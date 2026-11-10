// Peta dasar dari file PMTiles: contoh dari server, atau file dari perangkat (tanpa internet).
import { createMap, setTiles, setMapView } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/map.min.js";
import { openPMTiles } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/mapoffline.min.js";
import { onChange, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/element.min.js";

createMap("map", { tiles: false, center: [118, -2.5], zoom: 3, maxZoom: 6 });

// Di atas zoom terakhir di file, tile-nya diperbesar (overzoom) supaya peta tidak kosong.
function show(archive, error, label) {
    if (!archive) {
        setInnerText("status", `${label} gagal dibuka: ${error}`);
        return;
    }
    setTiles("map", archive, {
        maxNativeZoom: archive.maxZoom,
        maxZoom: archive.maxZoom + 3,
        attribution: archive.attribution || label,
    });
    const [minLng, minLat, maxLng, maxLat] = archive.bounds;
    const wholeWorld = maxLng - minLng >= 359;
    setMapView("map", wholeWorld ? [118, -2.5] : [(minLng + maxLng) / 2, (minLat + maxLat) / 2], Math.max(archive.minZoom, wholeWorld ? 3 : archive.centerZoom || archive.minZoom));
    setInnerText("status", `${label}: zoom ${archive.minZoom}-${archive.maxZoom}, ${archive.tileType}.`);
}

openPMTiles("data/toner.pmtiles", (archive, error) => show(archive, error, "Stamen Toner (contoh)"));

onChange("file", () => {
    const file = document.getElementById("file").files[0];
    if (!file) return;
    setInnerText("status", `Membuka ${file.name}...`);
    openPMTiles(file, (archive, error) => show(archive, error, file.name));
});
