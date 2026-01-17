// // Copyright 2026 Natalie Baker // AGPLv3 // //

import type { JSX } from "preact/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "preact/hooks";

import { useElementHeight } from "./use_size";

function useClampedStartIndex(count: number, displayRowsMax: number): [number, (value: number) => void] {
    const [startIndex, setStartIndex] = useState(0);
    return [
        Math.max(0, Math.min(count - displayRowsMax, Math.round(startIndex))), 
        setStartIndex
    ];
}

function useDisplayRows(calculateRowCount: (containerHeight: number) => number, containerHeight: number) {
    return useMemo(
        () => {
            if (containerHeight <= 0) return 0;
            return calculateRowCount(containerHeight);
        }, 
        [containerHeight]
    );
}

function useSyncScrollTop(element: HTMLElement | null, scrollTop: number) {
    useEffect(() => {
        if (!element) return;
        element.scrollTop = scrollTop;
    }, [element, scrollTop]);
}

export function VirtualList({maxRows, calculateRowCount: calculateDisplayRows, renderRowRange, selectedIndex, setSelectedIndex}: {
    maxRows: number,
    calculateRowCount: (containerHeight: number) => number,
    renderRowRange: (start: number, count: number, selectedIndex: number) => JSX.Element,

    selectedIndex?: number,
    setSelectedIndex?: (index: number) => void,
}) {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const containerHeight = useElementHeight(container);

    const displayRowsMax   = useDisplayRows(calculateDisplayRows, containerHeight ?? 0);
    const displayRowHeight = displayRowsMax > 0 ? (containerHeight ?? 0)/displayRowsMax : 0;

    const [startIndex, setStartIndex] = useClampedStartIndex(maxRows, displayRowsMax);
    const displayRows = Math.max(0, Math.min(displayRowsMax+startIndex, maxRows)-startIndex);

    useSyncScrollTop(container, startIndex);

    const setSelectedIndexClampedRaw = useCallback((v: number) => setSelectedIndex?.(Math.max(0, Math.min(maxRows-1, v))), [setSelectedIndex, maxRows]);
    const setSelectedIndexClamped = setSelectedIndex ? setSelectedIndexClampedRaw : undefined;

    const scrollViewTo = useCallback((newSelectedIndex: number) => {
        if ((newSelectedIndex >= startIndex) && (newSelectedIndex < startIndex + displayRowsMax)) return;
        if (newSelectedIndex < startIndex) {
            setStartIndex(newSelectedIndex);
        } else {
            setStartIndex(newSelectedIndex - (displayRowsMax - 1));
        }
    }, [startIndex, setStartIndex, displayRowsMax]);

    useLayoutEffect(() => {
            if (selectedIndex) {
                scrollViewTo(selectedIndex);
            }
        }, 
        [selectedIndex]
    );

    return <div
        tabIndex={0}
        ref={setContainer}
        style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "auto",
        }}    
        onScroll={ev => {
            setStartIndex(ev.currentTarget.scrollTop);
        }}
        onWheel={ev => {
            setStartIndex(startIndex + Math.sign(ev.deltaY));
            ev.preventDefault();
            ev.stopPropagation();
        }}
        onKeyDown={ev => {
            if (ev.key == "ArrowDown") {

                if (setSelectedIndexClamped && selectedIndex != undefined) {
                    const newSelectIndex = selectedIndex! + 1; 
                    setSelectedIndexClamped(newSelectIndex);
                    scrollViewTo(newSelectIndex);
                } else {
                    setStartIndex(startIndex + 1);
                }

                ev.preventDefault();
                ev.stopPropagation();
                return false;
            }

            if (ev.key == "ArrowUp") {
                if (setSelectedIndexClamped && selectedIndex != undefined) {
                    const newSelectIndex = selectedIndex! - 1; 
                    setSelectedIndexClamped(newSelectIndex);
                    scrollViewTo(newSelectIndex);
                } else {
                    setStartIndex(startIndex - 1);
                }

                ev.preventDefault();
                ev.stopPropagation();
                return false;
            }

            return true;
        }}
    >
        <div style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "100%",
            gridAutoRows: `${displayRowHeight}px`,
        }}>
            {(displayRowsMax > 0) && renderRowRange(startIndex, displayRows, selectedIndex ?? -1)}
        </div>

        {/* 
           We create the full-height box with no content, as
           this allows us to get around async scrolling positioning
           issues by allowing us to use sticky positioning

           Space already reserved by the sticky display above.
        */}
        <div style={{ height: maxRows - displayRowsMax }} />
    </div>;


}
