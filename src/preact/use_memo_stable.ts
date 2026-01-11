// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { shallowEqual } from "fast-equals";
import { useMemo, useRef, type Inputs } from "preact/hooks";

export function useMemoStable<T>(factory: () => T, deps: Inputs): T {
    const ref = useRef<T | undefined>(undefined);
    const value = useMemo<T>((): T => {
        const newValue = factory();
        if (shallowEqual(ref.current, newValue)) return ref.current!;
        ref.current = newValue;
        return newValue;
    }, deps);
    return value;
}
