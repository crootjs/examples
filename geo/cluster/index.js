// Contoh pengelompokan titik (clustering) untuk data titik yang sangat banyak.
//   map.js        petanya
//   mapcluster.js menggabungkan titik yang berdekatan menjadi gelembung berangka
//   mapcontrol.js garis skala
import { createMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/map.min.js";
import { addCluster } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/mapcluster.min.js";
import { addScaleBar } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/mapcontrol.min.js";
import { onChange, getValue, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.23/element.min.js";

let removeCluster = () => {}; // penghapus kelompok yang sedang tampil

createMap("map", { center: [110, -7.3], zoom: 6 });
addScaleBar("map");

onChange("jumlah", showPoints);
showPoints();

function showPoints() {
    const total = Number(getValue("jumlah"));
    const data = randomPoints(total);

    // Kelompok lama dibuang, lalu data baru dikelompokkan. Waktunya diukur supaya terlihat
    // berapa lama addCluster() menyiapkan titik sebanyak itu di perangkat ini.
    removeCluster();
    const start = performance.now();
    removeCluster = addCluster("map", data);
    const elapsed = Math.round(performance.now() - start);

    setInnerText("status", `${total.toLocaleString("id-ID")} titik disiapkan dalam ${elapsed} ms. Klik gelembung untuk memperbesar, klik titik untuk melihat datanya.`);
}

// Data contoh: titik acak yang mengumpul di sekitar 40 lokasi di Pulau Jawa. Angka acaknya
// berbenih tetap, jadi hasilnya sama setiap kali halaman dibuka.
function randomPoints(total) {
    let seed = 12345;
    const random = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const towns = Array.from({ length: 40 }, () => [106 + random() * 8, -8.2 + random() * 2]);

    const features = [];
    for (let i = 0; i < total; i++) {
        const town = towns[Math.floor(random() * towns.length)];
        // Sebagian besar titik rapat di sekitar lokasinya, sisanya tersebar jauh.
        const spread = random() < 0.7 ? 0.05 : 1.5;
        features.push({
            type: "Feature",
            properties: { nomor: i + 1 },
            geometry: { type: "Point", coordinates: [town[0] + (random() - 0.5) * spread, town[1] + (random() - 0.5) * spread] },
        });
    }
    return { type: "FeatureCollection", features };
}
