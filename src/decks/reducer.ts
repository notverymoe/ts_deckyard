// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { type Draft } from "immer";

import type { Card } from "../mtgjson/database";
import { underlying, type ImmerReturn } from "../util/immer";

import type { DeckStore, EntryProperties, Deck } from "./context";

export type DeckListsActions = 
    // Card Actions
    DeckStoreActionCardTransfer | DeckStoreActionCardModify |
    // Deck Actions
    DeckStoreActionDeckModify | DeckStoreActionDeckDestroy | DeckStoreActionDeckCreate | DeckStoreActionDeckClear |
    // Store Actions
    DeckStoreActionReset;

export function deckListReducer(
    draft: Draft<DeckStore>, 
    action: DeckListsActions
): ImmerReturn<DeckStore> {
    return doDeckListReducer(draft, action);
}

function doDeckListReducer(
    draft: Draft<DeckStore>, 
    action: DeckListsActions
): ImmerReturn<DeckStore> {
    switch(action.kind) {
        case "reset":
            return doReset(draft, action);

        case "deckCreate": 
            return doDeckCreate(draft, action);

        case "deckDestroy": 
            return doDeckDestory(draft, action);

        case "deckClear": 
            return doDeckClear(draft, action);

        case "deckModify": 
            return doDeckModify(draft, action);

        case "cardModify": 
            return doCardModify(draft, action);

        case "cardTransfer":
            return doCardTransfer(draft, action);

        default:
            throw new Error("Unknown DeckList action: " + JSON.stringify(action));
    }
}


// // Card Transfer // //

export type DeckStoreActionCardTransfer = {
    kind: "cardTransfer",
    target: string,
    source: string,
    card: Card,
    qty: number,
};

function doCardTransfer(
    draft: Draft<DeckStore>, 
    action: DeckStoreActionCardTransfer
): ImmerReturn<DeckStore> {
    
    // Check that source contians the card
    const source = draft.decks.get(action.source);
    if (source === undefined) {
        console.warn(`Deck list source (${action.source}) does not exist`);
        return;
    }

    const sourceEntry = source.cards.get(action.card);
    if (sourceEntry === undefined)  {
        console.warn(`Deck list source (${action.source}) does not contain card: ${action.card.name}`);
        return;
    }

    if (sourceEntry.qty !== null && sourceEntry.qty < action.qty) {
        console.warn(`Deck list source (${action.source}) only contains ${sourceEntry.qty} copies of (${action.card.name}) but ${action.qty} requested.`);
        return;
    }

    // Update Source
    if (sourceEntry.qty !== null) {
        sourceEntry.qty -= action.qty;
        if (sourceEntry.qty <= 0) {
            source.cards.delete(action.card);
        }
    }

    // Update Target
    const target = getOrSetDefault<string, Deck>(draft.decks, action.target, createDefaultDeck);
    let targetEntry = target.cards.get(action.card);

    if (targetEntry !== undefined) {
        // Only modify quantity if its tracked.
        if (targetEntry.qty !== null) {
            targetEntry.qty += action.qty;
        }
    } else {
        target.cards.set(action.card, {...underlying(sourceEntry), qty: action.qty });
    }
}

// // Card Modify // //

export type DeckStoreActionCardModify = {
    kind: "cardModify",
    target: string,
    card: Card,
    modify: (properties: Draft<EntryProperties>) => void
};

function doCardModify(
    draft: Draft<DeckStore>,
    action: DeckStoreActionCardModify
): ImmerReturn<DeckStore> {
    const deck = getOrSetDefault<string, Deck>(draft.decks, action.target, createDefaultDeck);
    let entry = deck.cards.get(action.card);
    if (entry !== undefined) {
        action.modify(entry);
        if (entry.qty !== null && entry.qty <= 0) deck.cards.delete(action.card);
    } else {
        entry = { qty: 0, tags: [] };
        action.modify(entry);
        if (entry.qty === null || entry.qty > 0) deck.cards.set(action.card, entry);
    }
}

// // Deck Modify // //

export type DeckStoreActionDeckModify = {
    kind: "deckModify",
    target: string,
    modify: (properties: Draft<Deck>) => void,
};

function doDeckModify(draft: Draft<DeckStore>, action: DeckStoreActionDeckModify): ImmerReturn<DeckStore> {
    const deck = getOrSetDefault<string, Deck>(draft.decks, action.target, createDefaultDeck);
    action.modify(deck);
}

// // Deck Create // //

export type DeckStoreActionDeckCreate = {
    kind: "deckCreate",
    target: string,
    init?: (properties: Draft<Deck>) => void,
};

function doDeckCreate(
    draft: Draft<DeckStore>, 
    action: DeckStoreActionDeckCreate
): ImmerReturn<DeckStore> {
    getOrSetDefault<string, Deck>(draft.decks, action.target, () => {
        const newDeck = createDefaultDeck();
        if(action.init) action.init(newDeck);
        return newDeck;
    });
}

// // Card Destroy // //

export type DeckStoreActionDeckDestroy = {
    kind: "deckDestroy",
    target: string,
};

function doDeckDestory(
    draft: Draft<DeckStore>, 
    action: DeckStoreActionDeckDestroy
): ImmerReturn<DeckStore> {
    draft.decks.delete(action.target);
}

// // Card Clear // //

export type DeckStoreActionDeckClear = {
    kind: "deckClear",
    target: string,
};

function doDeckClear(
    draft: Draft<DeckStore>, 
    action: DeckStoreActionDeckClear
): ImmerReturn<DeckStore> {
    const deck = getOrSetDefault<string, Deck>(draft.decks, action.target, createDefaultDeck);
    deck.cards.clear();
}

// // Reset // //

export type DeckStoreActionReset = {
    kind: "reset",
    init?: () => DeckStore,
};

function doReset(
    _draft: Draft<DeckStore>, 
    action: DeckStoreActionReset
): ImmerReturn<DeckStore> {
    return (action.init ?? (createDefaultDeckStore))();
}

// // Util // //

function getOrSetDefault<K, V>(map: Map<K, V>, key: K, getDefValue: () => V) {
    let result = map.get(key);
    if (result === undefined) {
        result = getDefValue();
        map.set(key, result);
    }
    return result;
}

export function createDefaultDeck(): Deck {
    return {
        cards: new Map(),
    }
}

export function createDefaultDeckStore(): DeckStore {
    return {
        decks: new Map(),
    }
}






