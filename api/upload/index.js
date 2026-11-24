import { uploadFile } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.39/api.min.js";
import { onClick, getValue, setInnerText, disableInput, enableInput } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.39/element.min.js";

// Layanan uji publik yang mengembalikan isi request sebagai JSON.
const TARGET = "https://httpbin.org/post";

let controller = null;

function sampleFile(megabytes) {
    const bytes = new Uint8Array(Math.round(megabytes * 1024 * 1024));
    // getRandomValues dibatasi 65536 byte per panggilan.
    for (let offset = 0; offset < bytes.length; offset += 65536) {
        crypto.getRandomValues(bytes.subarray(offset, offset + 65536));
    }
    return new File([bytes], "contoh.bin", { type: "application/octet-stream" });
}

onClick("upload", async () => {
    const file = sampleFile(Number(getValue("size")));
    controller = new AbortController();
    disableInput("upload");
    enableInput("cancel");
    document.getElementById("progress").value = 0;
    setInnerText("status", `Mengunggah ${file.name} (${(file.size / 1048576).toFixed(1)} MB)...`);

    const { status, data, error } = await uploadFile(TARGET, file, null, {
        field: "berkas",
        data: { keterangan: "contoh CrootJS" },
        signal: controller.signal,
        timeout: 20000,
        onProgress: (fraction) => {
            document.getElementById("progress").value = fraction;
        },
    });

    enableInput("upload");
    disableInput("cancel");
    if (status === 200) {
        setInnerText("status", `Terkirim. Server menerima field "keterangan" = "${data.form.keterangan}" dan file di field "${Object.keys(data.files)[0]}".`);
    } else if (error === "abort") {
        setInnerText("status", "Dibatalkan.");
    } else if (status === 0) {
        setInnerText("status", `Gagal (${error}).`);
    } else {
        setInnerText("status", `Server menjawab ${status}.`);
    }
});

onClick("cancel", () => controller && controller.abort());
