// // Copyright 2026 Natalie Baker // AGPLv3 // //

let cachedTextSizeRoot: [number, number] | undefined;


export function getTextSizeRoot(): [number, number] {
    if (!cachedTextSizeRoot) cachedTextSizeRoot = getTextSizes(document.body);
    return cachedTextSizeRoot;
}

export function rootLineHeightToPixels(lineHeight: number) {
    return getTextSizeRoot()[1] * lineHeight;
}

export function getTextSizes(parent: HTMLElement): [number, number] {
    const e = document.createElement("div");
    e.style.position = "absolute";
    e.style.top = "0";
    e.style.left = "0";
    e.style.width = "1ch";
    e.style.height = "1em";
    parent.appendChild(e);
    const height = e.clientHeight;
    const width  = e.clientWidth;
    parent.removeChild(e);
    return [width, height];
}
