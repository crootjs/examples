// Contoh alat survei di atas peta.
//   map.js        petanya; jaringan garis besar digambar dengan renderer canvas
//   mapcontrol.js koordinat kursor (dalam grid lokal), layar penuh, garis skala
//   maptools.js   alat ukur, master plan bergeoreferensi, ekspor PNG
//   geomeasure.js transformasi grid lokal <-> lng/lat dari titik kontrol
import { createMap, addGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/map.min.js";
import { addCoordinateControl, addFullscreenButton, addScaleBar } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/mapcontrol.min.js";
import { addMeasureControl, addImageOverlay, downloadMapImage } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/maptools.min.js";
import { createAffineTransform } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/geomeasure.min.js";
import { onClick, onInput, getValue, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/element.min.js";

createMap("map", { center: [107.5762, -6.8737], zoom: 17, maxZoom: 21 });

// Grid proyek contoh: tiga patok yang diketahui koordinat grid (meter) dan lng/lat-nya.
const grid = [[1000, 2000], [1500, 2000], [1000, 2400]];
const wgs84 = [[107.57390, -6.87560], [107.57844, -6.87557], [107.57387, -6.87198]];
const gridToWgs = createAffineTransform(grid, wgs84);

// Master plan ditempel dengan sudut-sudutnya dihitung dari grid, jadi ikut miring
// seperti grid proyeknya.
const masterPlan = addImageOverlay("map", "masterplan.svg", {
    corners: [gridToWgs([1020, 2380]), gridToWgs([1480, 2380]), gridToWgs([1020, 2058])],
    opacity: 0.6,
});
onInput("transparansi", () => masterPlan.setOpacity(Number(getValue("transparansi")) / 100));

// 5.600 garis: berat sebagai SVG di ponsel, ringan di canvas. simplify membuang titik
// yang tidak terlihat bedanya saat peta di-zoom jauh.
addGeoJSON("map", sampleNetwork(gridToWgs), {
    renderer: "canvas",
    simplify: 1,
    style: { stroke: "#7c3aed", strokeWidth: 1, strokeOpacity: 0.5 },
    hoverStyle: { stroke: "#dc2626", strokeWidth: 3, strokeOpacity: 1 },
    tooltip: (feature) => "Saluran " + feature.properties.kode,
    popup: false,
});

addMeasureControl("map", {
    onResult: (result) => setInnerText("status", (result.type === "area" ? "Luas: " : "Jarak: ") + result.text),
});
addCoordinateControl("map", {
    format: (position) => {
        const [x, y] = gridToWgs.inverse(position);
        return `X ${x.toFixed(2)}  Y ${y.toFixed(2)}`;
    },
});
addFullscreenButton("map", "top-right");
addScaleBar("map");

onClick("unduh", () => {
    downloadMapImage("map", "survei.png", (blob, info) => {
        if (!blob) {
            setInnerText("status", "Gagal membuat PNG.");
            return;
        }
        const skipped = info.missingImages ? `, ${info.missingImages} gambar dilewati` : "";
        setInnerText("status", `PNG ${info.width} x ${info.height} piksel diunduh${skipped}.`);
    });
});

// Data contoh: 80 baris x 70 saluran pendek bergelombang di dalam grid, dikonversi ke lng/lat.
function sampleNetwork(toWgs) {
    const features = [];
    for (let row = 0; row < 80; row++) {
        for (let column = 0; column < 70; column++) {
            const coordinates = [];
            for (let step = 0; step <= 12; step++) {
                const x = 1000 + column * 7 + step * 0.5;
                const y = 2000 + row * 5 + Math.sin(step + row + column) * 0.6;
                coordinates.push(toWgs([x, y]));
            }
            features.push({ type: "Feature", properties: { kode: `${row + 1}-${column + 1}` }, geometry: { type: "LineString", coordinates } });
        }
    }
    return { type: "FeatureCollection", features };
}
