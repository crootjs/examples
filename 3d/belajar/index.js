// Materi pembelajaran 3D: penjelasan per bagian, animasi perakitan, tampilan meledak,
// potongan melintang, dan kuis tebak bagian.
import { createViewer, loadModel, onModelClick, highlightPart, fitView } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.25/model3d.min.js";
import { playAnimation, explodeModel, addSection, addHotspot } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.25/model3dtools.min.js";
import { onClick, onInput, onChange, getValue, setValue, setInnerText } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.25/element.min.js";

// Penjelasan per kelompok bagian. Klik pada Tiang_2 atau Antena_2 dicocokkan lewat
// hit.path, jadi cukup satu penjelasan untuk "Sektor".
const MATERI = {
    Antena: ["Antena sektor", "Panel antena memancarkan dan menerima sinyal ke satu arah (sektor). Arah hadapnya disebut azimuth, kemiringannya ke bawah disebut downtilt."],
    Sektor: ["Sektor", "Satu menara biasanya melayani tiga sektor yang terpisah sekitar 120°, sehingga seluruh arah di sekitarnya tercakup."],
    Platform: ["Platform", "Lantai kerja di puncak menara, tempat antena dipasang dan teknisi bekerja saat perawatan."],
    Microwave: ["Antena microwave", "Piringan untuk menghubungkan BTS ini ke jaringan inti atau ke BTS lain secara nirkabel (transmisi), sebagai pengganti kabel serat optik."],
    Penangkal_Petir: ["Penangkal petir", "Batang logam di titik tertinggi yang menyalurkan sambaran petir ke tanah, melindungi perangkat di bawahnya."],
    Menara: ["Menara rangka", "Struktur baja segi empat. Warna merah-putih adalah tanda bahaya penerbangan untuk bangunan tinggi."],
    Kabinet: ["Kabinet perangkat", "Berisi perangkat radio dan baseband (BBU), catu daya, serta baterai cadangan."],
    Pondasi: ["Pondasi", "Beton bertulang yang menahan berat menara dan gaya angin, supaya menara tidak miring atau roboh."],
};
const QUIZ = ["Platform", "Microwave", "Penangkal_Petir", "Kabinet", "Pondasi", "Antena"];

createViewer("model", { autoRotate: 8 });
let animation = null;
let section = null;
let question = null;

loadModel("model", "../models/bts.glb", (info) => {
    if (!info) return;
    animation = playAnimation("model", "Perakitan", {
        autoplay: false,
        onUpdate: (time) => {
            setValue("time", time);
            setInnerText("time-text", time.toFixed(1).replace(".", ",") + " s");
        },
        onEnd: () => setInnerText("play", "Putar"),
    });
    animation.seek(animation.duration); // mulai dari menara yang sudah terpasang
    addHotspot("model", "Microwave", "Microwave");
    addHotspot("model", "Kabinet", "Kabinet");
});

// Nama kelompok materi untuk sebuah klik: bagian terdalam yang punya penjelasan.
function topicOf(hit) {
    for (let index = hit.path.length - 1; index >= 0; index--) {
        const name = hit.path[index].replace(/_\d+$/, "");
        if (MATERI[name]) return { name, part: hit.path[index] };
    }
    return null;
}

onModelClick("model", (hit) => {
    const topic = hit ? topicOf(hit) : null;
    highlightPart("model", topic ? topic.part : null);
    if (question) return answer(topic);
    if (!topic) return;
    setInnerText("part-name", MATERI[topic.name][0]);
    setInnerText("part-text", MATERI[topic.name][1]);
});

// Animasi dan tampilan meledak sama-sama menggeser bagian, jadi yang satu dikembalikan
// dulu sebelum yang lain dipakai.
onClick("play", () => {
    if (!animation) return;
    if (animation.isPlaying()) {
        animation.pause();
        setInnerText("play", "Putar");
        return;
    }
    resetExplode();
    animation.play();
    setInnerText("play", "Jeda");
});
onClick("reset", () => {
    if (!animation) return;
    animation.pause();
    animation.seek(animation.duration);
    setInnerText("play", "Putar");
});
onInput("time", () => {
    if (!animation) return;
    resetExplode();
    animation.pause();
    setInnerText("play", "Putar");
    animation.seek(Number(getValue("time")));
});

function resetExplode() {
    if (Number(getValue("explode")) === 0) return;
    setValue("explode", 0);
    setInnerText("explode-text", "0%");
    explodeModel("model", 0, { part: "Menara", animate: false });
}
onInput("explode", () => {
    if (animation) {
        animation.pause();
        animation.seek(animation.duration);
        setInnerText("play", "Putar");
    }
    const amount = Number(getValue("explode"));
    setInnerText("explode-text", Math.round(amount * 100) + "%");
    explodeModel("model", amount, { part: "Menara", animate: false, distance: 1.5 });
});

function updateSection() {
    const position = Number(getValue("cut-position"));
    setInnerText("cut-text", Math.round(position * 100) + "%");
    if (!document.getElementById("cut").checked) {
        if (section) section.remove();
        section = null;
        return;
    }
    const options = { axis: getValue("axis"), position, color: "#facc15" };
    if (section) section.set(options);
    else section = addSection("model", options);
}
onChange("cut", updateSection);
onChange("axis", updateSection);
onInput("cut-position", updateSection);

onClick("quiz", () => {
    question = QUIZ[Math.floor(Math.random() * QUIZ.length)];
    fitView("model");
    document.getElementById("quiz-text").className = "quiz";
    setInnerText("quiz-text", `Klik bagian: ${MATERI[question][0]}`);
});

function answer(topic) {
    const right = topic && topic.name === question;
    const text = document.getElementById("quiz-text");
    text.className = "quiz " + (right ? "quiz-right" : "quiz-wrong");
    setInnerText("quiz-text", right ? `Benar! Itu ${MATERI[question][0]}.` : `Belum tepat${topic ? `, itu ${MATERI[topic.name][0]}` : ""}. Coba lagi.`);
    if (right) question = null;
}
