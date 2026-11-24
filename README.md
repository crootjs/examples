# examples

[← croot.js.org](https://croot.js.org/) · [docs](https://croot.js.org/docs/) · [lib](https://croot.js.org/lib/)

Welcome to CrootJS Tutorial. To begin with this section you must know about Vanilla JS ES6+ script first.

## Coding Conventions (Mandatory)

Every example in this repo must keep HTML, CSS, and JS in separate files and load JS as `<script type="module">` — no inline `<style>`/`<script>` blocks, no `onclick`/`style=""` attributes. Full rules: https://croot.js.org/docs/conventions

Using an AI coding agent? Drop [`CLAUDE.md`](CLAUDE.md) (in this repo, or `curl -o CLAUDE.md https://raw.githubusercontent.com/crootjs/lib/main/CLAUDE.md`) into your project root so it follows this automatically.

## Section Steps
Please follow every step in every section :
1. [Element](./element/)
2. [Form Handling and RESTFull API](./api/)
3. [Geospatial Data](./geo/)
4. [3D Model](./3d/)
5. [Aplikasi offline (PWA)](./pwa/): catatan sederhana yang tetap terbuka tanpa internet dan bisa dipasang, dengan `pwa.js` dan `serviceworker.js`

## Pola halaman

[Pola halaman](./pola/): halaman lengkap siap salin yang tidak terlihat seperti buatan AI, dari `croot.css`, `ui.css` (komponen aplikasi), `themes.css` (tema `kampus`, `kertas`, `kontras`, `niaga`), dan `icons.css`. Galerinya punya pemilih tema dan mode terang/gelap yang dipakai semua pola.

- [Aplikasi](./pola/aplikasi/): sidebar yang menjadi laci di ponsel, breadcrumb, menu akun, angka ringkasan, grafik `chart.js`, tabel `table.js`
- [Masuk](./pola/login/): form masuk dengan validasi `form.js` dan tombol tampilkan kata sandi
- [Daftar dan detail](./pola/daftar-detail/): tabel di kiri, rincian dengan tab `tabs.js` di kanan
- [Formulir](./pola/formulir/): fieldset, penanda langkah, sakelar, unggah berkas, simpan/batal
- [Pengaturan](./pola/pengaturan/): akordeon `<details name>`, sakelar, dialog konfirmasi
- [Keadaan kosong dan 404](./pola/kosong-404/): belum ada data, pencarian tanpa hasil, skeleton, [halaman 404](./pola/kosong-404/404.html)
- [Landing page](./pola/landing/): judul, tempat tangkapan layar, daftar fitur, tanya jawab, footer

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/croot.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/ui.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.41/themes.min.css">
```

Styling: [croot.css showcase](./css/) — the 2 KB CSS framework used by the examples, plus the gallery of the 49 `icons.css` icons (`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/croot.min.css">`).

## Cookies based User Session Handling
To check the login cookies and redirect to the login page if the login cookie doesn't exist
```js
import {getCookie} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/cookie.min.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/url.min.js";

//check if login cookies is exist
if(!getCookie("login")){
    redirect("/");
}
```

## Form Handling
Get data from Form and Post to the server
```js
import {onClick,getValue} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/element.min.js";
import {postJSON} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/api.min.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/cookie.min.js";

onClick("submit",PostSignUp);

function PostSignUp(){
    let datainjson = {
        "nama": getValue("nama"),
        "email": getValue("email"),
        "phone":getValue("phone"),
        "nik":getValue("nik"),
        "pekerjaan":getValue("pekerjaan"),
        "alamat":getValue("alamat")
    }
    // postJSON(url, data, callback, tokenkey, tokenvalue) — token di dua argumen terakhir.
    postJSON("https://ped.fly.dev/auth/userdata",datainjson,responseFunction,"login",getCookie("login"));
}

function responseFunction(response){
    // Selalu dipanggil, termasuk saat request gagal total (status 0).
    console.log(response.status, response.data);
}
```

## Async Handling
This is a sample of a four-step run of the js command, where js can be run in serial and parallel mode:
```js
import {addCSS, addJS, runAfterDOM, runAfterAll} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.40/element.min.js";
// Step 1: run and wait until finish execute
await addCSS("https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css");
// Step 2: Just run without waiting until finished, immediately go to the next step
addJS("https://code.jquery.com/jquery-3.6.0.min.js");
// Step 3: Run after HTML loaded
runAfterDOM(function() {
  // initial HTML document has been completely loaded and parsed, without waiting
  // for stylesheets, images, and subframes to finish loading
  console.log('DOM fully loaded and parsed');
});
// Step 4: Run after all loaded
runAfterAll(function() {
    //This includes after-all assets like images, scripts, and CSS files.
    //Loaded
    console.log('The page has fully loaded');
});
```
