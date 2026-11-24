import { currentTheme, currentMode, setTheme, setMode } from "./tema.js";

const select = document.getElementById("tema");
const modeButtons = document.querySelectorAll("[data-mode]");

// aria-pressed membuat pilihan mode dibacakan pembaca layar, tidak hanya terlihat.
function showMode(mode) {
    modeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
}

select.value = currentTheme();
showMode(currentMode());
select.addEventListener("change", () => setTheme(select.value));
modeButtons.forEach(button => button.addEventListener("click", () => {
    setMode(button.dataset.mode);
    showMode(button.dataset.mode);
}));
