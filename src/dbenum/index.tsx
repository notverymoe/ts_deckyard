// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { createContext, type ComponentChildren } from "preact";
import { useContext, useMemo } from "preact/hooks";

import type { Card } from "../mtgjson/database";

export type NamedKey = {name: string, key: string};

const LEGALITIES_KNOWN = new Map<string, string>([
    ["commander", "Commander"],
    ["duel", "Duel"],
    ["legacy", "Legacy"],
    ["oathbreaker", "Oathbreaker"],
    ["vintage", "Vintage"],
    ["pauper", "Pauper"],
    ["brawl", "Brawl"],
    ["gladiator", "Gladiator"],
    ["historic", "Historic"],
    ["modern", "Modern"],
    ["paupercommander", "Pauper Commander"],
    ["pioneer", "Pioneer"],
    ["timeless", "Timeless"],
    ["future", "Future"],
    ["standard", "Standard"],
    ["standardbrawl", "Standard Brawl"],
    ["alchemy", "Alchemy"],
    ["penny", "Penny"],
    ["predh", "PreDH"],
    ["premodern", "Premodern"],
    ["oldschool", "Old School"],
]);


export type DatabaseEnumInfo = {
    legalities: NamedKey[],
}

const DatabaseEnumInfoContext = createContext<DatabaseEnumInfo | null>(null);

export function useNewDatabaseEnumInfo(init: () => Card[]): DatabaseEnumInfo {
    const enumInfo = useMemo(() => {
        const legalitiesSet = new Set<string>();
        for(const card of init()) {
            Object.keys(card.faces[0].legalities).forEach(v => legalitiesSet.add(v));
        }

        const legalities = Array.from(legalitiesSet.values(), (v): NamedKey => ({key: v, name: LEGALITIES_KNOWN.get(v) ?? `(?) ${v}`}));
        legalities.sort((a, b) => a.name.localeCompare(b.name));
        return {legalities}
    }, []);

    return enumInfo;
}

export function DatabaseEnumInfoProvider({enumInfo, children}: {
    enumInfo: DatabaseEnumInfo, 
    children: ComponentChildren
}) {
    return <DatabaseEnumInfoContext.Provider value={enumInfo}>{children}</DatabaseEnumInfoContext.Provider>
}

export function useDatabaseEnumInfo() {
    const result = useContext(DatabaseEnumInfoContext);
    if (!result) throw new Error("No database enum info context created!");
    return result;
}
