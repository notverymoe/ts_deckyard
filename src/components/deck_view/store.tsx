// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { useMemo, type Dispatch } from "preact/hooks";
import { useImmerReducer } from "use-immer";

import { type EntryProperties } from "../../decks/context";
import type { Card } from "../../mtgjson/database";

import { type DeckViewActions, deckStoreReducer } from "./reducer";

export type DeckViewStore = {
    activeView: number | null,
    views: DeckView[],
}

export type DeckViewFilter = (cards: Iterable<[Card, EntryProperties]>) => Iterable<[Card, EntryProperties]>;

export type DeckView = {
    selectedDeck: string | null,
    selectedCard: Card | null,
    viewFilter: DeckViewFilter | null,
};

export class DeckViewStoreActions {

    private dispatch: Dispatch<DeckViewActions>;

    constructor(dispatch: Dispatch<DeckViewActions>) {
        this.dispatch = dispatch;
    }

    setActive(target: number | null) {
        this.dispatch({kind: "setActive", target});
    }

    setSelectedDeck(target: number, deck: string | null) {
        this.dispatch({kind: "setSelectedDeck", target, deck});
    }

    setSelectedCard(target: number, card: Card | null) {
        this.dispatch({kind: "setSelectedCard", target, card});
    }

    setViewFilter(target: number, viewFilter: DeckViewFilter | null) {
        this.dispatch({kind: "setViewFilter", target, viewFilter});
    }

    addDeckViews(views: DeckView[]) {
        this.dispatch({kind: "addDeckViews", views});
    }

}


export function useNewDeckViewStore(init?: () => DeckViewStore): [DeckViewStore, DeckViewStoreActions] {
    const [deckViews, dispatch] = useImmerReducer<DeckViewStore, DeckViewActions, unknown>(
        deckStoreReducer, 
        undefined, 
        init ?? createDefaultDeckViewStore
    );
    const wrapped = useMemo(() => new DeckViewStoreActions(dispatch), [dispatch]);
    return [deckViews, wrapped];
}

export function createDefaultDeckViewStore(): DeckViewStore {
    return {
        activeView: null,
        views: [],
    }
}