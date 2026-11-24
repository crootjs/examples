import { renderMarkdown, getMarkdown } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/markdown.min.js";
import { debounce } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.34/debounce.min.js";

const source = document.getElementById("source");
const headingIds = document.getElementById("heading-ids");
const newTab = document.getElementById("new-tab");
const status = document.getElementById("status");

// Teks awal contoh, termasuk beberapa masukan jahat untuk memperlihatkan bahwa semuanya aman.
source.value = `# Contoh catatan

Teks **tebal**, *miring*, ~~coret~~, dan \`kode\`.
Baris ini diakhiri dua spasi  
jadi baris berikutnya turun.

## Daftar

- [x] Tulis Markdown
- [ ] Lihat pratinjau
  1. bertingkat
  2. berurut

> Kutipan
>> bertingkat

## Tabel (data contoh)

| Modul | Ukuran | Status |
|:--|--:|:-:|
| markdown.js | kecil | baru |
| debounce.js | kecil | lama |

\`\`\`js
renderMarkdown("pratinjau", teks);
\`\`\`

## Masukan jahat tetap aman

<script>alert("tidak jalan")</script>
<img src=x onerror=alert(1)>
[Tautan javascript:](javascript:alert(1)) menjadi teks biasa.
[Tautan biasa](https://croot.js.org/docs/markdown) dan <https://croot.js.org>.
`;

function render() {
    const html = renderMarkdown("preview", source.value, {
        headingIds: headingIds.checked,
        idPrefix: "md-",
        linkTarget: newTab.checked ? "_blank" : "",
    });
    document.getElementById("html").textContent = html;
}

source.addEventListener("input", debounce(render, 200));
headingIds.addEventListener("change", render);
newTab.addEventListener("change", render);

document.getElementById("load").addEventListener("click", async () => {
    const { status: code, markdown, error } = await getMarkdown("contoh.md", null);
    if (code !== 200) {
        status.textContent = `contoh.md gagal dimuat (${error || code}).`;
        return;
    }
    source.value = markdown;
    render();
    status.textContent = "contoh.md dimuat.";
});

render();
