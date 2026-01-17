// // Copyright 2026 Natalie Baker // AGPLv3 // //

import type { useSearchIndex } from "../../../search";

export type FilterParams = {
    mode: "off" | "simple" | "advanced",
    simple: string,
    advanced: {
        name: string,
        text: string,
        type: string,
        errata: string,
        costAll:  Set<string>,
        costAny:  Set<string>,
        costNone: Set<string>,
        legalities: Set<string>,
    }
};

export function newFilterEmpty(): FilterParams {
    return {
        mode: "off",
        simple: "",
        advanced: {
            name: "",
            text: "",
            type: "",
            errata: "",
            costAll:  new Set(),
            costAny:  new Set(),
            costNone: new Set(),
            legalities: new Set(),
        }
    };
}

export function newFilterAdvanced(advanced: FilterParams["advanced"]): FilterParams {
    return {
        mode:   "advanced",
        simple: "<Advanced Filter>",
        advanced,
    }
}

export function findSymbolAllIn(set: Set<string>, symbols: string) {
    if (set.size <= 0) return true;
    for(const symbol of set.keys()) {
        if (!symbols.includes(symbol)) {
            return false;
        }
    }
    return true;
}

export function findLegalityIn(set: Set<string>, legalities: Record<string, string>) {
    if (set.size <= 0) return true;
    for(const [k, v] of Object.entries(legalities)) {
        if (set.has(k)) continue;
        if (v !== "Banned") return true;
    }
    return false;
}

export function findSymbolAnyIn(set: Set<string>, symbols: string) {
    if (set.size <= 0) return true;
    for(const symbol of set.keys()) {
        if (symbols.includes(symbol)) return true;
    }
    return false;
}

export  function findSymbolNoneIn(set: Set<string>, symbols: string) {
    if (set.size <= 0) return true;
    for(const symbol of set.keys()) {
        if (symbols.includes(symbol)) return false;
    }
    return true;
}

export function doMultiSearch(
    searchIndex: ReturnType<typeof useSearchIndex>, 
    fields: [string, string][]
) {
    const searchTerms = fields.filter(([term, _]) => term.length > 0);
    if (searchTerms.length <= 0) return undefined;

    const searchResults = searchTerms.map(([term, field]) => searchIndex.search({
            query: term,
            resolve: false,
            field,
        }))
        .reduce((p, c) => p.and(c));
        
    return searchResults.resolve({
        limit: Number.MAX_SAFE_INTEGER
    });
}

export function doSearch(
    searchIndex: ReturnType<typeof useSearchIndex>, 
    term: string, 
    field?: string[] | string
) {
    return term.length > 0
        ? searchIndex.search({
            query: term,
            merge: true, 
            field, 
            limit: Number.MAX_SAFE_INTEGER
        }).map(v => v.id as string)
        : undefined;
}