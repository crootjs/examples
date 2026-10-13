# Geospatial Data

## GeoJSON

[Demo](./geojson/) and [Source Code](https://github.com/crootjs/examples/tree/main/geo/geojson)

`geo.js` mengambil dan memvalidasi GeoJSON, `map.js` menggambarnya di peta —
tanpa library peta eksternal. Fungsi `geo.js` ikut diekspor dari `map.js`, jadi
cukup satu import.

```js
import { createMap, addGeoJSON, fitMap, onMapClick, getGeoJSON, getPropertyKeys } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.14/map.min.js";

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
