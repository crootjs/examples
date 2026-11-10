# 3D Model

## Penampil Model 3D

[Demo](./viewer/) and [Source Code](https://github.com/crootjs/examples/tree/main/3d/viewer)

`model3d.js` menampilkan model glTF/GLB langsung di browser dengan WebGL —
tanpa Three.js atau library lain. Putar, zoom, klik sebuah bagian, atau buka
file `.glb` sendiri.

```js
import { createViewer, loadModel, getParts, highlightPart, fitView, onModelClick } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/model3d.min.js";

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

Di Android, tombol **Lihat di AR** membuka model di ruangan lewat kamera (Scene Viewer):

```js
import { addARButton } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/model3dtools.min.js";
addARButton("viewer", "../models/bts.glb", { title: "Menara BTS" });
```

## Editor Antena BTS

[Demo](./editor/) and [Source Code](https://github.com/crootjs/examples/tree/main/3d/editor)

Azimuth dan downtilt tiap sektor diatur dari isian angka, label 3D ikut
menempel di antena, bagian mana pun bisa diganti warnanya, disembunyikan,
atau digeser/diputar/diskala dengan gizmo, lalu hasilnya diunduh sebagai
`.glb` baru.

```js
import { setPartTransform, setPartColor } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/model3d.min.js";
import { addHotspot, enableTransform, downloadGLB } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/model3dtools.min.js";

setPartTransform("editor", "Sektor_2", { rotation: [0, -150, 0] });   // azimuth 150°
setPartTransform("editor", "Antena_2", { rotation: [6, 0, 0] });      // downtilt 6°
addHotspot("editor", "Antena_2", "S2 · 150° / 6°", { at: "top" });

const gizmo = enableTransform("editor", "Kabinet", "translate", (info) => {
    if (!info.dragging) console.log(info.position);
});

downloadGLB("editor", "bts-editan.glb");
```

## Materi 3D: Anatomi Menara BTS

[Demo](./belajar/) and [Source Code](https://github.com/crootjs/examples/tree/main/3d/belajar)

Contoh materi pembelajaran: klik bagian untuk membaca fungsinya, putar
animasi perakitan dengan slider waktu, pisahkan bagian-bagiannya, potong
menaranya, dan kuis "klik bagian X".

```js
import { playAnimation, explodeModel, addSection } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.27/model3dtools.min.js";

const animasi = playAnimation("model", "Perakitan", { onUpdate: (t) => setValue("time", t) });
onInput("time", () => animasi.seek(Number(getValue("time"))));

onInput("explode", () => explodeModel("model", Number(getValue("explode")), { part: "Menara", animate: false }));

const potongan = addSection("model", { axis: "x", color: "#facc15" });
onInput("cut-position", () => potongan.set({ position: Number(getValue("cut-position")) }));
```

Model menara BTS di [`models/bts.glb`](./models/bts.glb) dibuat khusus untuk
contoh ini (CC0): menara merah-putih, platform, tiga sektor antena
(`Sektor_1`–`Sektor_3`, masing-masing berisi `Tiang_n` dan `Antena_n`),
microwave, penangkal petir, kabinet, dan pondasi, plus animasi `Perakitan`
(7 detik) yang menurunkan bagian-bagian atas ke tempatnya satu per satu.
