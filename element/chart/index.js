import { createChart } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.37/chart.min.js";
import { onClick, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.37/element.min.js";
import { getLocal, setLocal } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.37/storage.min.js";

// Dua set data contoh (karangan) supaya tombol "Ganti data contoh" memperlihatkan update().
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const CONTOH = [
    {
        pendaftar: [[120, 135, 160, 150, 180, 210, 260, 240, 190, 170, 160, 175], [80, 95, 90, 110, 120, 150, 170, 165, 140, 120, 115, 130]],
        pengunjung: [[12400, 13100, 15800, 14900, 17600, 21000, 26300, 24800, 19200, 17400, 16100, 18900], [8200, 8900, 9400, 10100, 11800, 13500, 15900, 15200, 12800, 11600, 11000, 12300]],
        jalur: [420, 310, 180, 95]
    },
    {
        pendaftar: [[90, 110, 140, 165, 150, 190, 230, 280, 250, 200, 185, 205], [60, 70, 95, 105, 130, 125, 160, 190, 175, 150, 140, 150]],
        pengunjung: [[9800, 11200, 13900, 16800, 15400, 19800, 23700, 29100, 25400, 20800, 18900, 21100], [6100, 7200, 8800, 9900, 12100, 11800, 14700, 17800, 16300, 13900, 12800, 14200]],
        jalur: [380, 360, 210, 140]
    }
];
const JALUR = ["Reguler", "Prestasi", "Kerja sama", "Beasiswa"];

let set = 0;
const series = (values, names) => values.map((v, i) => ({ name: names[i], values: v }));

const batang = createChart("grafik-batang", {
    type: "bar",
    title: "Contoh: pendaftar per bulan",
    labels: BULAN,
    series: series(CONTOH[set].pendaftar, ["Sarjana", "Diploma"])
});
const garis = createChart("grafik-garis", {
    type: "line",
    title: "Contoh: pengunjung situs per bulan",
    labels: BULAN,
    series: series(CONTOH[set].pengunjung, ["Desktop", "Ponsel"])
});
const donat = createChart("grafik-donat", {
    type: "donut",
    title: "Contoh: pendaftar per jalur",
    height: 260,
    labels: JALUR,
    series: [{ name: "Pendaftar", values: CONTOH[set].jalur }],
    format: n => n.toLocaleString("id-ID") + " orang"
});

onClick("ganti", () => {
    set = (set + 1) % CONTOH.length;
    batang.update({ series: series(CONTOH[set].pendaftar, ["Sarjana", "Diploma"]) });
    garis.update({ series: series(CONTOH[set].pengunjung, ["Desktop", "Ponsel"]) });
    donat.update({ series: [{ name: "Pendaftar", values: CONTOH[set].jalur }] });
});

onClick("tumpuk", () => {
    const button = document.getElementById("tumpuk");
    const stacked = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(stacked));
    batang.update({ stacked });
});

// Tema: otomatis (ikut perangkat) -> terang -> gelap, diingat di localStorage.
// Warna grafik ikut berganti karena palet chart.js memakai variabel CSS.
const THEMES = ["otomatis", "terang", "gelap"];
const ATTRIBUTE = { terang: "light", gelap: "dark" };

function applyTheme(theme) {
    if (ATTRIBUTE[theme]) document.documentElement.dataset.theme = ATTRIBUTE[theme];
    else delete document.documentElement.dataset.theme;
    setInnerText("tema", "Tema: " + theme);
}

let theme = THEMES.includes(getLocal("contoh-tema")) ? getLocal("contoh-tema") : "otomatis";
applyTheme(theme);
onClick("tema", () => {
    theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setLocal("contoh-tema", theme);
    applyTheme(theme);
});
