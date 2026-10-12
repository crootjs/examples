// Contoh membaca data geospasial (GeoJSON) dengan geo.js dari CrootJS.
// geo.js mengurus pengambilan, validasi, dan ringkasan datanya; Leaflet hanya
// dipakai untuk menggambar hasilnya di peta.
import { getGeoJSON, readGeoJSONFile, getBBox, getCenter, getPropertyKeys, toLatLng } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.13/geo.min.js";
import { onClick, onChange, getValue, setInnerText, container } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.13/element.min.js";
import * as L from "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js";

// Peta dibuka di Indonesia dulu; begitu data masuk, tampilannya dipaskan ke datanya.
const map = L.map("map").setView([-2.5, 118], 4);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
let layer = null;

onClick("btn-load", loadFromURL);
onChange("file", loadFromFile);
loadFromURL();

// 1. Dari URL.
// getGeoJSON() selalu memanggil callback-nya dengan { status, data } — termasuk
// saat request gagal total — jadi "Memuat..." tidak akan pernah menggantung.
function loadFromURL() {
    setInnerText("status", "Memuat...");
    getGeoJSON(getValue("url"), showResponse);
}

function showResponse(response) {
    // status 0 berarti request tidak pernah selesai (offline, CORS ditolak,
    // atau lewat 15 detik) — bukan kode HTTP dari server.
    if (response.status === 0) {
        setInnerText("status", "Request gagal. Cek koneksi, atau server tidak mengizinkan CORS.");
        return;
    }
    if (response.status !== 200) {
        setInnerText("status", `Server membalas dengan status ${response.status}.`);
        return;
    }
    // status 200 dengan data null: balasannya ada, tapi isinya bukan GeoJSON.
    if (!response.data) {
        setInnerText("status", "Isi URL itu bukan GeoJSON.");
        return;
    }
    showData(response.data);
}

// 2. Dari file lokal.
// readGeoJSONFile() membaca file dari <input type="file">; callback-nya menerima
// FeatureCollection, atau null kalau file-nya bukan GeoJSON.
function loadFromFile() {
    readGeoJSONFile("file", (data) => {
        if (!data) {
            setInnerText("status", "File itu bukan GeoJSON.");
            return;
        }
        showData(data);
    });
}

// Apa pun sumbernya, data yang sampai di sini selalu FeatureCollection dengan
// properties berupa object, jadi feature.properties aman diakses tanpa cek null.
function showData(data) {
    const bbox = getBBox(data);
    const center = getCenter(data);

    if (layer) layer.remove();
    layer = L.geoJSON(data, { onEachFeature: bindPopup }).addTo(map);

    // bbox dan center null kalau tidak ada satu pun fitur yang punya koordinat.
    if (bbox) {
        // bbox GeoJSON berurutan [minLng, minLat, maxLng, maxLat], sedangkan Leaflet
        // meminta sudut-sudutnya sebagai [lat, lng] — toLatLng() yang membaliknya.
        map.fitBounds([toLatLng([bbox[0], bbox[1]]), toLatLng([bbox[2], bbox[3]])], { maxZoom: 18, padding: [24, 24] });
        setInnerText("status", `${data.features.length} fitur dimuat. Titik tengah (lng, lat): ${center[0].toFixed(6)}, ${center[1].toFixed(6)}`);
    } else {
        setInnerText("status", `${data.features.length} fitur dimuat, tanpa koordinat.`);
    }

    renderTable(data);
}

// Satu kolom per nama properti. getPropertyKeys() menggabungkan nama properti dari
// semua fitur, jadi fitur yang tidak punya properti tertentu mendapat sel kosong.
function renderTable(data) {
    const keys = getPropertyKeys(data);
    container("head").replaceChildren(rowOf("th", ["#", "Tipe", ...keys]));
    container("rows").replaceChildren(...data.features.map((feature, index) => rowOf("td", [
        index + 1,
        feature.geometry ? feature.geometry.type : "(tanpa geometri)",
        ...keys.map((key) => formatValue(feature.properties[key])),
    ])));
}

// Isi sel dan popup dipasang lewat textContent, bukan innerHTML: datanya berasal
// dari URL/file sembarang, jadi tidak boleh ikut dieksekusi sebagai HTML.
function rowOf(cellTag, values) {
    const row = document.createElement("tr");
    values.forEach((value) => {
        const cell = document.createElement(cellTag);
        cell.textContent = value;
        row.appendChild(cell);
    });
    return row;
}

function bindPopup(feature, featureLayer) {
    const lines = Object.entries(feature.properties).map(([key, value]) => `${key}: ${formatValue(value)}`);
    if (lines.length === 0) return;
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = lines.join("\n");
    featureLayer.bindPopup(popup);
}

function formatValue(value) {
    if (value === undefined || value === null) return "";
    return typeof value === "object" ? JSON.stringify(value) : String(value);
}
