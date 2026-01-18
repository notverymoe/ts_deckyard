// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { useMemo, type Dispatch } from "preact/hooks";
import { useImmerReducer } from "use-immer";
import type { Draft } from "immer";

import type { Card } from "../mtgjson/database";

import { createDefaultDeckStore, deckListReducer, type DeckListsActions } from "./reducer";

export type EntryProperties = {
    qty: number | null,
    tags: string[],
};

export type Deck = {
    cards: Map<Card, EntryProperties>;
}

export type DeckStore = {
    decks: Map<string, Deck>;
}

export class DeckStoreActions {

    private dispatch: Dispatch<DeckListsActions>;

    constructor(dispatch: Dispatch<DeckListsActions>) {
        this.dispatch = dispatch;
    }

    public cardTransfer(target: string, source: string, card: Card, qty?: number) {
        this.dispatch({kind: "cardTransfer", target, source, card, qty: qty ?? 1});
    }

    public cardModify(target: string, card: Card, modify: (properties: Draft<EntryProperties>) => void) {
        this.dispatch({kind: "cardModify", target, card, modify});
    }

    public deckModify(target: string, modify: (deck: Draft<Deck>) => void) {
        this.dispatch({kind: "deckModify", target, modify});
    }

    public deckDestroy(target: string) {
        this.dispatch({kind: "deckDestroy", target});
    }

    public deckCreate(target: string, init?: (deck: Draft<Deck>) => void) {
        this.dispatch({kind: "deckCreate", target, init});
    }

    public reset(init?: () => DeckStore) {
        this.dispatch({kind: "reset", init});
    }

}

export function useNewDeckStore(init?: () => DeckStore): [DeckStore, DeckStoreActions] {
    const [deckLists, dispatch] = useImmerReducer<DeckStore, DeckListsActions, unknown>(
        deckListReducer, 
        undefined, 
        init ?? createDefaultDeckStore
    );
    const wrapped = useMemo(() => new DeckStoreActions(dispatch), [dispatch]);
    return [deckLists, wrapped];
}


export function resetDeckStoreWithDatabase(database: Deck): DeckStore {
    return {
        decks: new Map<string, Deck>([
            ["Database",      database],
            ["Mainboard",     {cards: new Map()}],
            ["Sideboard",     {cards: new Map()}],
            ["Considerboard", {cards: new Map()}],
        ])
    };
}
