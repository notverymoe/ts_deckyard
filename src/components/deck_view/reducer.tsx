// // Copyright 2026 Natalie Baker // AGPLv3 // //

import type { Draft } from "immer";

import type { ImmerReturn } from "../../util/immer";
import type { Card } from "../../mtgjson/database";

import type { DeckView, DeckViewFilter, DeckViewStore } from "./store";

export type DeckViewActions = DeckViewActionSetActive | 
    DeckViewActionSetSelectedDeck | 
    DeckViewActionSetSelectedCard | 
    DeckViewActionSetViewFilter |
    DeckViewActionAdd;

export function deckStoreReducer(
    draft: Draft<DeckViewStore>, 
    action: DeckViewActions
): ImmerReturn<DeckViewStore> {
    switch(action.kind) {
        case "setActive":
            return doSetActive(draft, action);

        case "setSelectedCard":
            return doSetSelectedCard(draft, action);

        case "setSelectedDeck":
            return doSetSelectedDeck(draft, action);

        case "setViewFilter":
            return doSetViewFilter(draft, action);

        case "addDeckViews":
            return doAddDeckView(draft, action);

        default:
            throw new Error("Unknown DeckView action: " + JSON.stringify(action));
    }
}

// // Set Active View // //

export type DeckViewActionSetActive = {
    kind: "setActive",
    target: number | null,
};

function doSetActive(
    draft: Draft<DeckViewStore>, 
    action: DeckViewActionSetActive
): ImmerReturn<DeckViewStore> {
    if (draft.activeView === action.target) return;
    if ((action.target !== null) && ((action.target < 0)|| (action.target >= draft.views.length))) {
        console.warn("Attempt to set active view to: " + action.target);
        return;
    }
    draft.activeView = action.target;
}

// // Set Selected Deck // //

export type DeckViewActionSetSelectedDeck = {
    kind: "setSelectedDeck",
    target: number,
    deck: string | null,
};

function doSetSelectedDeck(
    draft: Draft<DeckViewStore>, 
    action: DeckViewActionSetSelectedDeck
): ImmerReturn<DeckViewStore> {
    const view = draft.views[action.target];
    if (!view) return;
    view.selectedDeck = action.deck;
}

// // Set Selected Card // //

export type DeckViewActionSetSelectedCard = {
    kind: "setSelectedCard",
    target: number,
    card: Card | null,
};


function doSetSelectedCard(
    draft: Draft<DeckViewStore>, 
    action: DeckViewActionSetSelectedCard
): ImmerReturn<DeckViewStore> {
    const view = draft.views[action.target];
    if (!view) return;
    view.selectedCard = action.card;
}

// // Set View Filter // //

export type DeckViewActionSetViewFilter = {
    kind: "setViewFilter",
    target: number,
    viewFilter: DeckViewFilter | null,
};

function doSetViewFilter(
    draft: Draft<DeckViewStore>, 
    action: DeckViewActionSetViewFilter
): ImmerReturn<DeckViewStore> {
    const view = draft.views[action.target];
    if (!view) return;
    view.viewFilter = action.viewFilter;
}

// // Add // //

export type DeckViewActionAdd = {
    kind: "addDeckViews",
    views: DeckView[],
};

function doAddDeckView(
    draft: Draft<DeckViewStore>, 
    action: DeckViewActionAdd
): ImmerReturn<DeckViewStore> {
    draft.views.push.apply(draft.views, action.views);
}

