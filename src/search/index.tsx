// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { useContext, useMemo } from "preact/hooks";
import type { Card } from "../mtgjson/database";
import { createContext, type ComponentChildren } from "preact";
import { createCardSearchIndex } from "./flexsearch";

const SearchIndexContext = createContext<ReturnType<typeof useNewSearchIndex> | null>(null);

export function useNewSearchIndex(init: () => Card[]) {
    const searchIndex = useMemo(() => createCardSearchIndex(init()), []);
    return searchIndex;
}

export function SearchIndexProvider({searchIndex, children}: {
    searchIndex: ReturnType<typeof useNewSearchIndex>, 
    children: ComponentChildren
}) {
    return <SearchIndexContext.Provider value={searchIndex}>{children}</SearchIndexContext.Provider>
}

export function useSearchIndex() {
    const result = useContext(SearchIndexContext);
    if (!result) throw new Error("No search context created!");
    return result;
}