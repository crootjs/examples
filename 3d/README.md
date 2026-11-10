# 3D Model

## Penampil Model 3D

[Demo](./viewer/) and [Source Code](https://github.com/crootjs/examples/tree/main/3d/viewer)

`model3d.js` menampilkan model glTF/GLB langsung di browser dengan WebGL —
tanpa Three.js atau library lain. Putar, zoom, klik sebuah bagian, atau buka
file `.glb` sendiri.

```js
import { createViewer, loadModel, getParts, highlightPart, fitView, onModelClick } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.24/model3d.min.js";

createViewer("viewer", { autoRotate: 12 });
loadModel("viewer", "../models/bts.glb", (info, error) => {
    console.log(info ? info.parts : error);
});

onModelClick("viewer", (hit) => {
    highlightPart("viewer", hit ? hit.part : null);
});

// file dari <input type="file" id="file">
loadModel("viewer", document.getElementById("file").files[0]);
```

Elemen penampilnya wajib diberi tinggi lewat CSS, misalnya `.viewer { height: 460px; }`.

## Editor Antena BTS

[Demo](./editor/) and [Source Code](https://github.com/crootjs/examples/tree/main/3d/editor)

Azimuth dan downtilt tiap sektor diatur dari isian angka, label 3D ikut
menempel di antena, bagian mana pun bisa diganti warnanya, disembunyikan,
atau digeser/diputar/diskala dengan gizmo, lalu hasilnya diunduh sebagai
`.glb` baru.

```js
import { setPartTransform, setPartColor } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.24/model3d.min.js";
import { addHotspot, enableTransform, downloadGLB } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.24/model3dtools.min.js";

setPartTransform("editor", "Sektor_2", { rotation: [0, -150, 0] });   // azimuth 150°
setPartTransform("editor", "Antena_2", { rotation: [6, 0, 0] });      // downtilt 6°
addHotspot("editor", "Antena_2", "S2 · 150° / 6°", { at: "top" });

const gizmo = enableTransform("editor", "Kabinet", "translate", (info) => {
    if (!info.dragging) console.log(info.position);
});

downloadGLB("editor", "bts-editan.glb");
```

Model menara BTS di [`models/bts.glb`](./models/bts.glb) dibuat khusus untuk
contoh ini (CC0): menara merah-putih, platform, tiga sektor antena
(`Sektor_1`–`Sektor_3`, masing-masing berisi `Tiang_n` dan `Antena_n`),
microwave, penangkal petir, kabinet, dan pondasi.
