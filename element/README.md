# Element 

## SweetAlert

[Demo](./sweetalert/) and [Source Code](https://github.com/crootjs/examples/tree/main/element/sweetalert)

SweetAlert2 mengurus tampilan dialog; CrootJS mengurus event, pembacaan input,
validasi, dan request-nya. Paket npm SweetAlert2 hanya mengirim JS lewat ES
module, jadi CSS-nya dimuat terpisah dengan `addCSS()`.

```js
import { onClick, getValue, addCSS } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.19/element.min.js";
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
import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.19/element.min.js";
import * as croot from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.19/element.min.js";


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
import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.19/element.min.js";
import * as croot from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.19/element.min.js";


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
