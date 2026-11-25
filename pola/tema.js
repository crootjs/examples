import { getLocal, setLocal } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.43/storage.min.js";

// Tema pilihan di galeri pola juga dipakai setiap halaman pola, supaya satu halaman bisa
// dibandingkan dalam beberapa tema. "" = tampilan bawaan croot.css / mengikuti perangkat.
export const THEMES = ["", "kampus", "kertas", "kontras", "niaga"];
export const MODES = ["", "light", "dark"];

function apply(attribute, value) {
    if (value) document.documentElement.setAttribute(attribute, value);
    else document.documentElement.removeAttribute(attribute);
}

export function currentTheme() {
    return THEMES.includes(getLocal("pola-tema")) ? getLocal("pola-tema") : "";
}

export function currentMode() {
    return MODES.includes(getLocal("pola-mode")) ? getLocal("pola-mode") : "";
}

export function setTheme(theme) {
    setLocal("pola-tema", theme);
    apply("data-croot-theme", theme);
}

export function setMode(mode) {
    setLocal("pola-mode", mode);
    apply("data-theme", mode);
}

apply("data-croot-theme", currentTheme());
apply("data-theme", currentMode());
