import dateFormat from "dateformat";
import { PromiseWrapped } from "../util/promise";

export function getDefaultFilename(base: string, ext: string) {
    return `${base}-${dateFormat(new Date(), "yyyy-mm-dd_hh-MM-ss_l")}.${ext}`;
}

export async function fileSave(base: string, ext: string, data: Blob) {
    // TODO window.showSaveDialog path
    // TODO tauri save path
    return await fallbackFileSave(base, ext, data);
}

export async function fileLoadText(exts: string[]) {
    // TODO window.showLoadDialog path
    // TODO tauri load path
    return await fallbackFileLoadText(exts);
}

async function fallbackFileSave(base: string, ext: string, data: Blob) {
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = getDefaultFilename(base, ext);
    link.click();
    URL.revokeObjectURL(url);
}

async function fallbackFileLoadText(exts: string[]) {
    const dialog = document.createElement("input");
    dialog.type = "file";
    dialog.accept = exts.join(",");

    const p = new PromiseWrapped<string | null>();
    dialog.oncancel = () => p.resolve(null);
    dialog.onchange = async () => p.resolve(await (dialog.files?.item(0)?.text()) ?? null);
    dialog.click();

    const contents = await p;
    return contents;
}