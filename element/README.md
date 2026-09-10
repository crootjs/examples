# Element 

## SweetAlert

Contoh penggunaan sweetalert
```js
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.7/element.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

await addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");


if (result.status === 200) {
    Swal.fire('Success', 'File uploaded successfully!', 'success');
} else {
    Swal.fire('Error', 'File upload failed!', 'error');
}

// Tampilkan SweetAlert loading sebelum memulai upload
Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while your file is being uploaded.',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading(); // Tampilkan loading indicator
        }
});

// Tutup SweetAlert loading setelah upload selesai
Swal.close();
```
Lengkapnya [disini](sweetalert.js)

## Set

[Demo](./set/) and [Source Code](https://github.com/jscroot/examples/tree/main/element/set)

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
import { setInner } from "https://jscroot.github.io/element/croot.js";
import * as croot from "https://jscroot.github.io/element/croot.js";


setInner("demo","Dari croot.js import fungsi");
croot.setInner("demo2","Dari croot.js import fungsi dengan nama croot");
```

## SVG

[Demo](./svg/) and [Source Code](https://github.com/jscroot/examples/tree/main/element/svg)

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
import { setInner } from "https://jscroot.github.io/element/croot.js";
import * as croot from "https://jscroot.github.io/element/croot.js";


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
