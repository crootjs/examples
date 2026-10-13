# Geospatial Data

## GeoJSON

[Demo](./geojson/) and [Source Code](https://github.com/crootjs/examples/tree/main/geo/geojson)

`geo.js` mengambil dan memvalidasi GeoJSON, `map.js` menggambarnya di peta —
tanpa library peta eksternal. Fungsi `geo.js` ikut diekspor dari `map.js`, jadi
cukup satu import.

```js
import { createMap, addGeoJSON, fitMap, onMapClick, getGeoJSON, getPropertyKeys } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.min.js";

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
import { createMap, addGeoJSON, fitMap, getGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.min.js";
import { findRoute } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/georoute.min.js";

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
import { createMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.min.js";
import { addCluster } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/mapcluster.min.js";

createMap("map", { center: [110, -7.3], zoom: 6 });

// data: GeoJSON berisi fitur-fitur Point. Klik gelembung untuk memperbesar,
// klik titik satuan untuk melihat properties-nya.
const removeCluster = addCluster("map", data);
```

Contoh lengkapnya di [`cluster/`](./cluster/) bisa diganti antara 1.000,
20.000, dan 100.000 titik acak, dan menampilkan berapa milidetik persiapannya
di perangkatmu.
