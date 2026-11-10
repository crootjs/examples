// Penampil model 3D: memuat GLB, daftar bagian, klik untuk memilih, dan buka file sendiri.
import { createViewer, loadModel, getParts, highlightPart, fitView, onModelClick, setAutoRotate } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/model3d.min.js";
import { addARButton } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/model3dtools.min.js";
import { onClick, onChange, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/element.min.js";

createViewer("viewer", { autoRotate: 12 });
loadModel("viewer", "../models/bts.glb", responseFunction);
// Di Android: buka model BTS di ruangan lewat kamera (Scene Viewer). Di perangkat lain tidak muncul.
addARButton("viewer", "../models/bts.glb", { title: "Menara BTS" });

function responseFunction(info, error) {
    if (!info) {
        setInnerText("status", "Model gagal dimuat: " + error);
        return;
    }
    setInnerText("status", `${info.parts.length} bagian, ${info.triangles.toLocaleString("id-ID")} segitiga, `
        + `ukuran ${info.bounds.size.map((value) => value.toFixed(2)).join(" × ")}. Klik sebuah bagian.`);
    showParts();
}

// Daftar bagian, menjorok menurut kedalamannya di pohon model.
function showParts() {
    const list = document.getElementById("parts");
    list.textContent = "";
    getParts("viewer").forEach((part) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "depth-" + Math.min(part.depth, 4);
        button.textContent = part.name;
        button.dataset.part = part.name;
        button.addEventListener("click", () => {
            select(part.name);
            fitView("viewer", part.name);
        });
        item.appendChild(button);
        list.appendChild(item);
    });
}

function select(name) {
    highlightPart("viewer", name);
    document.querySelectorAll("#parts button").forEach((button) => {
        button.classList.toggle("selected", button.dataset.part === name);
    });
}

onModelClick("viewer", (hit) => {
    if (!hit) {
        select(null);
        setInnerText("status", "Tidak ada bagian di titik itu.");
        return;
    }
    select(hit.part);
    setInnerText("status", `${hit.path.join(" › ")} di (${hit.position.map((value) => value.toFixed(2)).join(", ")})`);
});

onChange("file", () => {
    const file = document.getElementById("file").files[0];
    if (!file) return;
    setInnerText("status", "Membuka " + file.name + "...");
    loadModel("viewer", file, responseFunction);
});

onClick("reset", () => fitView("viewer"));

// Putaran otomatis berhenti sendiri begitu model disentuh.
onClick("spin", () => setAutoRotate("viewer", 12));
