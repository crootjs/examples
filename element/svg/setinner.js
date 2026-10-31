import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.21/element.min.js";
import * as croot from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.21/element.min.js";


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