// Peta dasar dari file PMTiles (raster atau vektor): contoh dari server, atau file dari
// perangkat (tanpa internet).
import { createMap, setTiles, setMapView } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.43/map.min.js";
import { openPMTiles } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.43/mapoffline.min.js";
import { onChange, onClick, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.43/element.min.js";

createMap("map", { tiles: false, center: [118, -2.5], zoom: 3, maxZoom: 6 });

// Di atas zoom terakhir di file, tile-nya diperbesar (overzoom) supaya peta tidak kosong.
function show(archive, error, label) {
    if (!archive) {
        setInnerText("status", `${label} gagal dibuka: ${error}`);
        return;
    }
    // Tile vektor digambar ulang di atas zoom file (maxZoom sudah termasuk overzoom); tile
    // raster diperbesar.
    const vector = archive.tileType === "mvt";
    setTiles("map", archive, {
        maxNativeZoom: archive.maxZoom,
        maxZoom: vector ? archive.maxZoom : archive.maxZoom + 3,
        attribution: archive.attribution || label,
    });
    const [minLng, minLat, maxLng, maxLat] = archive.bounds;
    const wholeWorld = maxLng - minLng >= 359;
    setMapView("map", wholeWorld ? [118, -2.5] : [(minLng + maxLng) / 2, (minLat + maxLat) / 2], Math.max(archive.minZoom, wholeWorld ? 3 : archive.centerZoom || archive.minZoom));
    setInnerText("status", vector
        ? `${label}: vektor, isi file zoom ${archive.minZoom}-${archive.fileMaxZoom}, tajam sampai zoom ${archive.maxZoom}.`
        : `${label}: zoom ${archive.minZoom}-${archive.maxZoom}, ${archive.tileType}.`);
}

const RASTER = "data/toner.pmtiles";
// Contoh resmi dari repositori PMTiles, dipatok ke satu commit supaya tidak berubah.
const VECTOR = "https://raw.githubusercontent.com/protomaps/PMTiles/957d54ac93cb2605e435a34d3deb704ef8c202f4/spec/v3/protomaps%28vector%29ODbL_firenze.pmtiles";

function openRaster() {
    setInnerText("status", "Memuat data/toner.pmtiles...");
    openPMTiles(RASTER, (archive, error) => show(archive, error, "Stamen Toner (contoh)"));
}

openRaster();
onClick("raster", openRaster);
onClick("vector", () => {
    setInnerText("status", "Memuat peta vektor Firenze...");
    openPMTiles(VECTOR, (archive, error) => show(archive, error, "Firenze (vektor)"), { language: "it" });
});

onChange("file", () => {
    const file = document.getElementById("file").files[0];
    if (!file) return;
    setInnerText("status", `Membuka ${file.name}...`);
    openPMTiles(file, (archive, error) => show(archive, error, file.name));
});
