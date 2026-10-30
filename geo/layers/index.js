// Contoh peta teknis dengan lapisan bernama dan beberapa peta dasar.
//   map.js        petanya: lapisan bernama, garis putus-putus, label, hover
//   mapcontrol.js pilihan peta dasar, daftar centang lapisan, garis skala
import { createMap, addGeoJSON, fitMap, getLayers } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.17/map.min.js";
import { addBasemapControl, addLayerControl, addScaleBar } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.17/mapcontrol.min.js";
import { setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.17/element.min.js";

const ESRI_IMAGERY = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_LABELS = "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

// Citra Esri di banyak wilayah hanya sampai zoom 18; maxNativeZoom membuatnya diperbesar
// sampai zoom 21, bukan kosong.
createMap("map", { center: [107.5759, -6.8736], zoom: 16, maxZoom: 21 });

const area = [107.5735, -6.8760, 107.5785, -6.8712]; // [minLng, minLat, maxLng, maxLat]
const data = sampleData(area);

addGeoJSON("map", data.zones, {
    name: "zona",
    style: (feature) => ({ stroke: feature.properties.warna, fill: feature.properties.warna, strokeDasharray: [6, 4] }),
    hoverStyle: { strokeWidth: 4, fillOpacity: 0.45 },
    tooltip: (feature) => feature.properties.nama,
    label: "kode",
});
addGeoJSON("map", data.fiber, {
    name: "fiber",
    order: 2, // di atas zona, apa pun urutan ditambahkannya
    // Jalur yang masih rencana digambar putus-putus.
    style: (feature) => ({
        stroke: "#ea580c",
        strokeWidth: 4,
        strokeDasharray: feature.properties.status === "rencana" ? [10, 6] : null,
        lineCap: "butt",
    }),
    popup: (feature) => `Jalur ${feature.properties.kode} (${feature.properties.status})`,
});
addGeoJSON("map", data.contours, {
    name: "kontur",
    // Di bawah zona: area klik garis (20 piksel) yang rapat akan menutupi hover zona.
    order: -1,
    style: { stroke: "#7c3aed", strokeWidth: 1, strokeOpacity: 0.7 },
    popup: false,
    label: (feature) => feature.properties.elevasi + " m",
    labelOptions: { minZoom: 17, className: "label-kontur" },
});
addGeoJSON("map", data.blocks, {
    name: "blok",
    minZoom: 18, // denah blok baru berguna dari dekat
    style: { stroke: "#374151", strokeWidth: 1, fill: "#9ca3af", fillOpacity: 0.3 },
    label: "nomor",
});

addBasemapControl("map", [
    { name: "Jalan" }, // tanpa tiles = OpenStreetMap
    { name: "Satelit", tiles: ESRI_IMAGERY, maxNativeZoom: 18, attribution: "Tiles © Esri" },
    { name: "Hybrid", tiles: ESRI_IMAGERY, labels: ESRI_LABELS, maxNativeZoom: 18, attribution: "Tiles © Esri" },
]);
addLayerControl("map", [
    { name: "zona", label: "Batas zona" },
    { name: "fiber", label: "Jalur fiber" },
    { name: "kontur", label: "Kontur" },
    { name: "blok", label: "Denah blok (zoom 18+)" },
], { onChange: showActiveLayers });
addScaleBar("map");

// Panel di pojok kanan atas lebarnya sekitar 170 piksel: data dipaskan di sisa ruangnya.
fitMap("map", area, { right: 190 });

function showActiveLayers() {
    const active = getLayers("map").filter((layer) => layer.visible).map((layer) => layer.name);
    setInnerText("status", "Lapisan aktif: " + (active.length ? active.join(", ") : "tidak ada") + ".");
}

// Data contoh di dalam kotak `bbox`: 4 zona, 3 jalur fiber, 12 garis kontur, 24 blok.
function sampleData(bbox) {
    const [west, south, east, north] = bbox;
    const midLng = (west + east) / 2;
    const midLat = (south + north) / 2;
    const rectangle = (x1, y1, x2, y2) => ({ type: "Polygon", coordinates: [[[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]]] });
    const feature = (properties, geometry) => ({ type: "Feature", properties, geometry });

    const colors = ["#2563eb", "#16a34a", "#d97706", "#db2777"];
    const zones = [[west, midLat, midLng, north], [midLng, midLat, east, north], [west, south, midLng, midLat], [midLng, south, east, midLat]]
        .map((box, index) => feature({ kode: "Z" + (index + 1), nama: "Zona " + (index + 1), warna: colors[index] }, rectangle(...box)));

    const fiber = [
        feature({ kode: "F1", status: "terpasang" }, { type: "LineString", coordinates: [[west, midLat], [midLng, midLat], [midLng, north]] }),
        feature({ kode: "F2", status: "terpasang" }, { type: "LineString", coordinates: [[midLng, midLat], [east, midLat]] }),
        feature({ kode: "F3", status: "rencana" }, { type: "LineString", coordinates: [[midLng, midLat], [midLng, south], [east, south]] }),
    ];

    const contours = Array.from({ length: 12 }, (_, index) => {
        const lat = south + (north - south) * (index + 0.5) / 12;
        const wave = (north - south) / 40;
        const coordinates = Array.from({ length: 9 }, (_, step) => [west + (east - west) * step / 8, lat + Math.sin(step + index) * wave]);
        return feature({ elevasi: 700 + index * 5 }, { type: "LineString", coordinates });
    });

    const blocks = [];
    const size = (east - west) / 14;
    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 6; column++) {
            const x = west + size * (1 + column * 2);
            const y = north - size * (1.5 + row * 2.2);
            blocks.push(feature({ nomor: String.fromCharCode(65 + row) + (column + 1) }, rectangle(x, y - size, x + size * 1.5, y)));
        }
    }
    return { zones, fiber, contours, blocks };
}
