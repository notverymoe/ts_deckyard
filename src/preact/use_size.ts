// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { useEffect, useState } from "preact/hooks";

export function useElementSize(
    element: HTMLElement | null | undefined, 
    defaultSize?: [number, number] | undefined,
): [number | undefined, number | undefined];

export function useElementSize(
    element: HTMLElement | null | undefined, 
    defaultSize: [number, number]
): [number, number];

export function useElementSize(
    element: HTMLElement | null | undefined, 
    defaultSize?: [number, number] | undefined,
):  [number | undefined, number | undefined] {
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!element) return;

        const resizeObserver = new ResizeObserver(
            events => events.forEach(ev => setRect(DOMRect.fromRect(ev.contentRect)))
        );
        setRect(DOMRect.fromRect({
            x: element.clientLeft,
            y: element.clientTop,
            width: element.clientWidth,
            height: element.clientHeight
        }));

        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, [element]);

    return [
        rect?.width  ?? defaultSize?.[0], 
        rect?.height ?? defaultSize?.[1], 
    ];
}

export function useElementWidth(
    element: HTMLElement | null | undefined, 
    defaultSize: number, 
): number;

export function useElementWidth(
    element: HTMLElement | null | undefined, 
): number | undefined;

export function useElementWidth(
    element: HTMLElement | null | undefined, 
    defaultSize?: number, 
): number | undefined {
    return useElementSize(
        element, 
        defaultSize != undefined 
            ? [defaultSize, defaultSize] 
            : undefined
    )?.[0];
}



export function useElementHeight(
    element: HTMLElement | null | undefined, 
    defaultSize: number, 
): number;

export function useElementHeight(
    element: HTMLElement | null | undefined, 
): number | undefined;

export function useElementHeight(
    element: HTMLElement | null | undefined, 
    defaultSize?: number, 
): number | undefined {
    return useElementSize(
        element, 
        defaultSize != undefined 
            ? [defaultSize, defaultSize] 
            : undefined
    )?.[1];
}
