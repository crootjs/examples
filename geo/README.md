# Geospatial Data

## GeoJSON

[Demo](./geojson/) and [Source Code](https://github.com/crootjs/examples/tree/main/geo/geojson)

`geo.js` mengambil dan memvalidasi GeoJSON, `map.js` menggambarnya di peta —
tanpa library peta eksternal. Fungsi `geo.js` ikut diekspor dari `map.js`, jadi
cukup satu import.

```js
import { createMap, addGeoJSON, fitMap, onMapClick, getGeoJSON, getPropertyKeys } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/map.min.js";

// <div id="map"> harus punya tinggi dari CSS.
createMap("map");

// Link halaman file GitHub (/blob/) boleh dipakai langsung.
getGeoJSON("https://github.com/petapedia/geojson/blob/main/contoh.geojson", (response) => {
    // status 0 = request gagal total; data null = isinya bukan GeoJSON.
    if (!response.data) {
        console.log("gagal membaca GeoJSON, status:", response.status);
        return;
    }
    console.log(response.data.features.length);   // 3
    console.log(getPropertyKeys(response.data));  // ["Gedung", "Kampus"]

    addGeoJSON("map", response.data); // klik sebuah fitur untuk melihat properties-nya
    fitMap("map", response.data);
});

// position = [lng, lat]; feature = fitur yang kena klik, atau null.
onMapClick("map", (position, feature) => {
    console.log(position, feature ? feature.properties : "peta dasar");
});
```

Contoh lengkapnya di [`geojson/`](./geojson/): memuat dari URL, membaca file
lokal dengan `readGeoJSONFile()`, menggambar di peta dengan `map.js`, membaca
koordinat klik, dan membuat tabel properti dari `getPropertyKeys()`.

## Rute

[Demo](./route/) and [Source Code](https://github.com/crootjs/examples/tree/main/geo/route)

`georoute.js` mencari rute terpendek di sepanjang garis-garis di dalam data
GeoJSON — dihitung di browser, tanpa layanan rute. Hasilnya Feature LineString
biasa, jadi langsung bisa digambar dengan `addGeoJSON()`.

```js
import { createMap, addGeoJSON, fitMap, getGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/map.min.js";
import { findRoute } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/georoute.min.js";

createMap("map");

getGeoJSON("jalan.geojson", (response) => {
    if (!response.data) return;

    // Kedua titik boleh di mana saja; masing-masing ditempelkan ke jalan terdekat.
    const route = findRoute([107.575914, -6.8732098], [107.5772, -6.8752], response.data);
    if (!route) {
        console.log("Kedua titik tidak terhubung.");
        return;
    }
    addGeoJSON("map", route, { style: { stroke: "#2563eb", strokeWidth: 5 } });
    fitMap("map", route);
    console.log(Math.round(route.properties.distance), "m"); // 514 m
});
```

Contoh lengkapnya di [`route/`](./route/) memakai semua modul peta sekaligus:
pin A dan B yang bisa digeser (`mapmarker.js`), garis skala dan tombol "lokasi
saya" (`mapcontrol.js`), dan jarak garis lurus sebagai pembanding
(`geomeasure.js`). Data jalannya potongan OpenStreetMap di sekitar kampus ULBI
(© OpenStreetMap contributors, ODbL).

## Pengelompokan Titik

[Demo](./cluster/) and [Source Code](https://github.com/crootjs/examples/tree/main/geo/cluster)

`mapcluster.js` menggabungkan titik yang berdekatan menjadi gelembung berangka,
sehingga puluhan ribu titik tetap ringan. Hanya kelompok yang sedang terlihat
yang digambar.

```js
import { createMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/map.min.js";
import { addCluster } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/mapcluster.min.js";

createMap("map", { center: [110, -7.3], zoom: 6 });

// data: GeoJSON berisi fitur-fitur Point. Klik gelembung untuk memperbesar,
// klik titik satuan untuk melihat properties-nya.
const removeCluster = addCluster("map", data);
```

Contoh lengkapnya di [`cluster/`](./cluster/) bisa diganti antara 1.000,
20.000, dan 100.000 titik acak, dan menampilkan berapa milidetik persiapannya
di perangkatmu.

## Lapisan dan Peta Dasar

[Demo](./layers/) and [Source Code](https://github.com/crootjs/examples/tree/main/geo/layers)

Peta teknis dengan lapisan bernama: tiap lapisan bisa disembunyikan, diganti
gayanya, dan diatur urutan tumpuknya tanpa menggambar ulang, dan peta dasarnya
bisa diganti tanpa membuat ulang peta.

```js
import { createMap, addGeoJSON, fitMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/map.min.js";
import { addBasemapControl, addLayerControl } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/mapcontrol.min.js";

createMap("map", { maxZoom: 21 });

addGeoJSON("map", zona, {
    name: "zona",
    style: { strokeDasharray: [6, 4] },             // garis putus-putus
    hoverStyle: { strokeWidth: 4 },                 // highlight saat kursor di atasnya
    tooltip: (feature) => feature.properties.nama,
    label: "kode",                                  // label di titik berat polygon
});
addGeoJSON("map", blok, { name: "blok", minZoom: 18 }); // hanya tampil dari dekat

addBasemapControl("map", [
    { name: "Jalan" },
    { name: "Satelit", tiles: ESRI_IMAGERY, maxNativeZoom: 18, attribution: "Tiles © Esri" },
    { name: "Hybrid", tiles: ESRI_IMAGERY, labels: ESRI_LABELS, maxNativeZoom: 18, attribution: "Tiles © Esri" },
]);
addLayerControl("map", ["zona", "blok"]);

fitMap("map", zona, { right: 190 }); // sisakan ruang untuk panel di kanan
```

Contoh lengkapnya di [`layers/`](./layers/): zona dengan tooltip, jalur fiber
terpasang (utuh) dan rencana (putus-putus), kontur berlabel yang muncul mulai
zoom 17, dan denah blok mulai zoom 18. Semua datanya buatan.

## Alat Survei

[Demo](./survey/) and [Source Code](https://github.com/crootjs/examples/tree/main/geo/survey)

Alat untuk peta teknis dan survei: ukur jarak dan luas, koordinat kursor dalam
grid proyek, gambar master plan bergeoreferensi, ribuan garis di canvas, layar
penuh, dan unduh tampilan sebagai PNG.

```js
import { createMap, addGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/map.min.js";
import { addCoordinateControl, addFullscreenButton } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/mapcontrol.min.js";
import { addMeasureControl, addImageOverlay, downloadMapImage } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/maptools.min.js";
import { createAffineTransform } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.18/geomeasure.min.js";

createMap("map", { maxZoom: 21 });

// Grid CAD -> lng/lat dari tiga patok yang diketahui kedua koordinatnya.
const gridToWgs = createAffineTransform(patokGrid, patokWgs84);

addMeasureControl("map", { onResult: (result) => console.log(result.text) });
addCoordinateControl("map", {
    format: (position) => gridToWgs.inverse(position).map((v) => v.toFixed(2)).join(", "),
});
addFullscreenButton("map", "top-right");
addImageOverlay("map", "masterplan.svg", { bounds: [107.5739, -6.8756, 107.5784, -6.8720], rotation: 0, opacity: 0.6 });
addGeoJSON("map", jaringan, { renderer: "canvas", simplify: 1 }); // ribuan garis tetap ringan

downloadMapImage("map", "survei.png");
```

Contoh lengkapnya di [`survey/`](./survey/): master plan yang sudut-sudutnya
dihitung dari grid (jadi ikut miring seperti gridnya) dengan penggeser
transparansi, 5.600 saluran contoh dengan tooltip, dan status hasil ukur dan
unduhan. Semua datanya buatan.
