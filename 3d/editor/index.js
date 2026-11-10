// Editor antena BTS: azimuth/tilt per sektor, label 3D, warna, gizmo, dan ekspor GLB.
//   model3d.js       penampil, warna, sembunyikan, posisi/rotasi lewat kode, klik bagian
//   model3dtools.js  label yang menempel di model, gizmo geser/putar/skala, unduh .glb
import { createViewer, loadModel, onModelClick, highlightPart, setPartColor, setPartVisible, getPartTransform, setPartTransform, fitView } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.26/model3d.min.js";
import { addHotspot, enableTransform, downloadGLB } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.26/model3dtools.min.js";
import { onClick, onChange, onInputs, getValue, setValue, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.26/element.min.js";

const SECTORS = [1, 2, 3];
const BUTTONS = ["color", "reset-color", "hide", "mode-translate", "mode-rotate", "mode-scale", "mode-off"];

createViewer("editor");
loadModel("editor", "../models/bts.glb", (info) => {
    if (!info) return;
    SECTORS.forEach((sector) => {
        addHotspot("editor", "Antena_" + sector, labelOf(sector), { at: "top", offset: [0, 0.3, 0] });
        applySector(sector);
    });
    fitView("editor", ["Sektor_1", "Sektor_2", "Sektor_3"]);
});

let selected = null;
let gizmo = null;

// Label hotspot: elemen sendiri supaya isinya bisa diperbarui tanpa membuat ulang hotspotnya.
const labels = {};
function labelOf(sector) {
    labels[sector] = document.createElement("span");
    labels[sector].className = "sector-label";
    return labels[sector];
}

// Sektor menghadap +Z pada azimuth 0 dan berputar searah jarum jam dilihat dari atas, jadi
// azimuth dipasang sebagai putaran negatif di sumbu Y. Tilt memutar panelnya di sumbu X.
function applySector(sector) {
    const azimuth = Number(getValue("az" + sector)) || 0;
    const tilt = Number(getValue("tilt" + sector)) || 0;
    setPartTransform("editor", "Sektor_" + sector, { rotation: [0, -azimuth, 0] });
    setPartTransform("editor", "Antena_" + sector, { rotation: [tilt, 0, 0] });
    labels[sector].textContent = `S${sector} · ${azimuth}° / ${tilt}°`;
}
onInputs("sector-input", (input) => applySector(Number(input.id.slice(-1))));

function showTransform(transform) {
    if (!transform) {
        setInnerText("transform", "—");
        return;
    }
    const format = (values) => values.map((value) => value.toFixed(2)).join(", ");
    setInnerText("transform", `posisi  ${format(transform.position)}\nrotasi  ${format(transform.rotation)}\nskala   ${format(transform.scale)}`);
}

function select(name) {
    selected = name;
    highlightPart("editor", name);
    setInnerText("selected", name || "—");
    BUTTONS.forEach((id) => { document.getElementById(id).disabled = !name; });
    document.getElementById("hide").checked = false;
    setMode(null);
    showTransform(name ? getPartTransform("editor", name) : null);
}

onModelClick("editor", (hit) => select(hit ? hit.part : null));

onChange("color", () => setPartColor("editor", selected, getValue("color")));
onClick("reset-color", () => setPartColor("editor", selected, null));
onChange("hide", () => setPartVisible("editor", selected, !document.getElementById("hide").checked));

function setMode(mode) {
    if (gizmo) gizmo.remove();
    gizmo = mode ? enableTransform("editor", selected, mode, onTransform) : null;
    ["translate", "rotate", "scale"].forEach((name) => {
        document.getElementById("mode-" + name).classList.toggle("active", name === mode);
    });
}

// Gizmo yang memutar sebuah sektor ikut memperbarui isian azimuth-nya.
function onTransform(transform) {
    showTransform(transform);
    const match = /^Sektor_(\d)$/.exec(transform.part);
    if (match && Math.abs(transform.rotation[0]) < 0.01 && Math.abs(transform.rotation[2]) < 0.01) {
        const azimuth = Math.round(((-transform.rotation[1] % 360) + 360) % 360);
        setValue("az" + match[1], azimuth);
        labels[match[1]].textContent = `S${match[1]} · ${azimuth}° / ${getValue("tilt" + match[1])}°`;
    }
}

onClick("mode-translate", () => setMode("translate"));
onClick("mode-rotate", () => setMode("rotate"));
onClick("mode-scale", () => setMode("scale"));
onClick("mode-off", () => setMode(null));

onClick("download", () => downloadGLB("editor", "bts-editan.glb"));
