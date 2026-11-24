# Element 

## Dashboard dengan Router

[Demo](./router/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/router)

Dashboard satu halaman dengan `router.js` (lib 0.0.33) mode hash: beranda, daftar mahasiswa
(data contoh) dengan pencarian `?q=`, detail `/mahasiswa/:nim`, dan halaman 404. Sesudah
pindah halaman, fokus ke judul dan tautan menu yang aktif diberi `aria-current`.

## Tabel Data

[Demo](./table/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/table)

`table.js` (lib 0.0.33), pengganti jQuery DataTables: tabel proyek (data contoh) dari
`data.json` lewat `getJSON` yang bisa diurut, dicari, dan dibagi per halaman, ditambah
mode server yang disimulasikan.

## Grafik SVG

[Demo](./chart/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/chart)

Grafik batang, garis, dan donat dari `chart.js` (lib 0.0.33) dengan data contoh, tombol
ganti data, batang bertumpuk, dan mode gelap. Tooltip juga muncul dengan keyboard.

## Editor Markdown

[Demo](./markdown/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/markdown)

Textarea dengan pratinjau langsung (`markdown.js` + `debounce.js`), memuat file `.md`
dengan `getMarkdown`, dan bukti bahwa HTML atau tautan `javascript:` di masukan tetap aman.

## Kode QR

[Demo](./qr/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/qr)

`qr.js` (lib 0.0.33): ketik teks atau alamat, kode QR-nya langsung berubah, lalu unduh
sebagai SVG.

```js
import { renderQR } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/qr.min.js";

renderQR("qr", "https://croot.js.org", { label: "Kode QR ke croot.js.org" });
```

## Papan Kanban

[Demo](./kanban/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/kanban)

Dibawa dari `jscroot/kanban`: kartu diseret antarkolom dengan mouse, atau dipindah dengan
tombol panah dari keyboard dan layar sentuh. Kartu baru lewat `<dialog>` + `form.js`, isi
papan tersimpan dengan `storage.js`, tampilan dari `croot.css`.

## Validasi Form

[Demo](./form/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/form)

`form.js` (lib 0.0.30): pesan di bawah setiap field yang salah dari atribut HTML
(`required`, `type="email"`, `minlength`, `pattern`) plus aturan sendiri (konfirmasi
kata sandi, minimal satu minat), dan `fillForm` untuk mengisi form dari data.

```js
import { handleForm } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/form.min.js";

handleForm("daftar", (data) => console.log(data), {
    rules: { ulang: (value, all) => (value !== all.sandi ? "Kata sandi tidak sama." : null) },
});
```

## SweetAlert

[Demo](./sweetalert/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/sweetalert)

SweetAlert2 mengurus tampilan dialog; CrootJS mengurus event, pembacaan input,
validasi, dan request-nya. Paket npm SweetAlert2 hanya mengirim JS lewat ES
module, jadi CSS-nya dimuat terpisah dengan `addCSS()`.

```js
import { onClick, getValue, addCSS } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/element.min.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

await addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Alert biasa
Swal.fire('Success', 'File uploaded successfully!', 'success');

// Tampilkan loading sebelum request dimulai
Swal.fire({
    title: 'Uploading...',
    text: 'Please wait while your file is being uploaded.',
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
        Swal.showLoading();
    }
});

// Tutup loading setelah request selesai
Swal.close();
```

Contoh lengkapnya di [`sweetalert/`](./sweetalert/): alert per tipe, konfirmasi
sebelum menghapus, form dengan validasi di dalam dialog, dan indikator loading
saat `getJSON()` berjalan.

## Set

[Demo](./set/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/set)

index.html  
```html
<!DOCTYPE html>
<html>
<body>
<h1>JavaScript Modules</h1>

<p id="demo"></p>
<p id="demo2"></p>


<script type="module" src="./setinner.js"></script>
</body>
</html>
```
setinner.js  
```js
import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/element.min.js";
import * as croot from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/element.min.js";


setInner("demo","Dari croot.js import fungsi");
croot.setInner("demo2","Dari croot.js import fungsi dengan nama croot");
```

## SVG

[Demo](./svg/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/svg)

index.html  
```html
<!DOCTYPE html>
<html>
<body>
<h1>JavaScript Modules</h1>

<p id="demo"></p>
<p id="demo2"></p>

<canvas id="myCanvas"></canvas>
<script type="module" src="./index.js"></script>
</body>
</html>
```

index.js  
```js
import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/element.min.js";
import * as croot from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/element.min.js";


setInner("demo","anu");
croot.setInner("demo2","inu");

updateCanvas("apa maksude","myCanvas");

function updateCanvas(text,id) {
    var c = document.getElementById(id);
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 400, 200);
    ctx.fillStyle = "#212121";
    ctx.fillRect(0, 0, 400, 200)
    var gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, '#39FF14');
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;
    var fontface = "Courier";
    ctx.font = "30px Courier";
    ctx.textAlign = 'center';
    // start with a large font size
      var fontsize=300;
      // lower the font size until the text fits the canvas
      do{
          fontsize--;
          ctx.font=fontsize+"px "+fontface;
      }while(ctx.measureText(text).width>c.width)
    ctx.fillText(text, 150, 100);
    console.log(ctx.measureText(text).width);
  }
```
