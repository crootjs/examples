import {
    setInner,
    show,
    hide,
    getValue,
    getFileSize,
    onClick,
  } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.17/element.min.js";
  import { postFile } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.17/api.min.js";

  onClick("uploadbutton", uploadImage);

  const target_url =
    "https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/upload/img";

  function uploadImage() {
    if (!getValue("imageInput")) {
      alert("Please select an image file");
      return;
    }
    hide("inputfile");
    let besar = getFileSize("imageInput");
    setInner("isi", besar);
    postFile(target_url, "imageInput", "image", renderToHtml);
  }

  function renderToHtml(result) {
    console.log(result);
    // postFile memanggil callback dengan null kalau request gagal atau body
    // respons bukan JSON.
    if (!result) {
      setInner("isi", "Upload gagal, coba lagi.");
      show("inputfile");
      return;
    }
    setInner("isi", "https://cdn.blkkalittifaq.id/"+result.response);
    show("inputfile");
  }
