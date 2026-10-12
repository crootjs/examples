# Geospatial Data

## GeoJSON

[Demo](./geojson/) and [Source Code](https://github.com/crootjs/examples/tree/main/geo/geojson)

`geo.js` mengambil dan memvalidasi GeoJSON; Leaflet hanya menggambar hasilnya.
Dari mana pun datanya datang, callback selalu menerima `FeatureCollection`
dengan `properties` berupa object.

```js
import { getGeoJSON, getBBox, getPropertyKeys, toLatLng } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.13/geo.min.js";

// Link halaman file GitHub (/blob/) boleh dipakai langsung.
getGeoJSON("https://github.com/petapedia/geojson/blob/main/contoh.geojson", (response) => {
    // status 0 = request gagal total; data null = isinya bukan GeoJSON.
    if (!response.data) {
        console.log("gagal membaca GeoJSON, status:", response.status);
        return;
    }
    console.log(response.data.features.length);   // 3
    console.log(getPropertyKeys(response.data));  // ["Gedung", "Kampus"]

    // GeoJSON: [lng, lat]. Leaflet: [lat, lng].
    const bbox = getBBox(response.data);
    console.log(toLatLng([bbox[0], bbox[1]]), toLatLng([bbox[2], bbox[3]]));
});
```

Contoh lengkapnya di [`geojson/`](./geojson/): memuat dari URL, membaca file
lokal dengan `readGeoJSONFile()`, menggambar di peta Leaflet, dan membuat tabel
properti dari `getPropertyKeys()`.
