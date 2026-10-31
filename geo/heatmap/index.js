// Contoh heatmap dan peta cakupan sinyal dari titik-titik drive test.
//   map.js        petanya, plus lokasi BTS sebagai titik GeoJSON di atas lapisan panas
//   mapcontrol.js garis skala
//   mapheat.js    heatmap kepadatan dan peta petak (persegi/heksagon) menurut rata-rata RSRP
import { createMap, addGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.22/map.min.js";
import { addScaleBar } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.22/mapcontrol.min.js";
import { addHeatmap, addGridMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.22/mapheat.min.js";
import { onChange, getValue, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.22/element.min.js";

const SITES = [
    { nama: "BTS Sukajadi", position: [107.5905, -6.8890] },
    { nama: "BTS Cipaganti", position: [107.6045, -6.8990] },
    { nama: "BTS Pasteur", position: [107.5845, -6.9040] },
];

// Ambang RSRP yang lazim dipakai: makin tinggi (mendekati 0) makin baik.
const RSRP_BREAKS = [
    { value: -140, color: "#d7191c", label: "Sangat lemah (< -110)" },
    { value: -110, color: "#fdae61", label: "Lemah (-110 – -100)" },
    { value: -100, color: "#ffffbf", label: "Sedang (-100 – -90)" },
    { value: -90, color: "#a6d96a", label: "Baik (-90 – -80)" },
    { value: -80, color: "#1a9641", label: "Sangat baik (≥ -80)" },
];

createMap("map", { center: [107.5935, -6.8975], zoom: 14, maxZoom: 19 });
addScaleBar("map");

// [lng, lat, rsrp]: array lebih hemat daripada GeoJSON untuk data sebesar ini.
const measurements = sampleDriveTest(SITES, 12000);

let layer = null;
function show() {
    if (layer) layer.remove();
    const mode = getValue("tampilan");
    if (mode === "heat") {
        layer = addHeatmap("map", measurements.map(([lng, lat]) => [lng, lat]), {
            scale: getValue("skala"),
            legend: { title: "Kepadatan pengukuran", low: "Jarang", high: "Padat" },
        });
        setInnerText("status", "Heatmap: makin merah, makin banyak titik pengukuran di sekitarnya.");
        return;
    }
    layer = addGridMap("map", measurements, {
        aggregate: "mean",
        shape: mode === "hex" ? "hex" : "square",
        cellMeters: mode === "hex" ? 150 : undefined,
        cellSize: 28,
        breaks: RSRP_BREAKS,
        legend: { title: "RSRP rata-rata (dBm)" },
        popup: (cell) => `${cell.value.toFixed(1)} dBm · ${cell.count} pengukuran`,
        onClick: (cell) => setInnerText("status",
            `Petak di ${cell.center[1].toFixed(5)}, ${cell.center[0].toFixed(5)}: rata-rata ${cell.value.toFixed(1)} dBm `
            + `(${cell.min} s.d. ${cell.max}) dari ${cell.count} pengukuran - ${cell.label}.`),
    });
    setInnerText("status", "Klik sebuah petak untuk melihat nilainya.");
}
show();
onChange("tampilan", show);
onChange("skala", show);

// Lokasi BTS di atas lapisan panas: lapisan addGeoJSON selalu di atas mapheat.js.
addGeoJSON("map", {
    type: "FeatureCollection",
    features: SITES.map((site) => ({ type: "Feature", properties: { nama: site.nama }, geometry: { type: "Point", coordinates: site.position } })),
}, {
    style: { radius: 7, fill: "#111827", stroke: "#fff", strokeWidth: 2, fillOpacity: 1 },
    popup: (feature) => feature.properties.nama,
});

// Data contoh: titik-titik di sepanjang "jalan" acak di sekitar BTS. RSRP turun menurut
// jarak ke BTS terdekat, ditambah derau.
function sampleDriveTest(sites, total) {
    let seed = 20261031;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const points = [];
    while (points.length < total) {
        // satu ruas jalan: garis lurus pendek dengan titik ukur setiap beberapa meter
        const site = sites[Math.floor(random() * sites.length)];
        const angle = random() * Math.PI * 2;
        const distance = Math.pow(random(), 0.6) * 0.02;
        let lng = site.position[0] + Math.cos(angle) * distance;
        let lat = site.position[1] + Math.sin(angle) * distance;
        const heading = random() * Math.PI * 2;
        for (let step = 0; step < 40 && points.length < total; step++) {
            lng += Math.cos(heading) * 0.00012;
            lat += Math.sin(heading) * 0.00012;
            const nearest = Math.min(...sites.map((s) => Math.hypot(s.position[0] - lng, s.position[1] - lat)));
            const rsrp = -68 - nearest * 2600 + (random() - 0.5) * 10;
            points.push([lng, lat, Math.round(Math.max(-135, rsrp))]);
        }
    }
    return points;
}
