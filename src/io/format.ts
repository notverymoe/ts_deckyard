import type { DeckStore, EntryProperties } from "../decks/context";
import type { Card } from "../mtgjson/database";

type UIDWithProps = [string, EntryProperties];
type CardWithProps = [Card, EntryProperties];

type DeckStoreDisk = {
    decks: Record<string, {
        cards: Record<string, EntryProperties>,
    }>,
}

export function writeDeckyardFormat(store: DeckStore) {
    const decks: DeckStoreDisk["decks"] = {};
    
    for(const [deckName, deck] of store.decks.entries()) {
        if (deckName === "Database") continue;
        decks[deckName] = {
            cards: Object.fromEntries(Array.from(
                deck.cards.entries(),
                ([card, props]): UIDWithProps => [card.uid, props]
            ))
        };
    }

    return JSON.stringify({decks});
}

export function readDeckyardFormat(
    database: Record<string, Card>, 
    content: string
): DeckStore {
    const decks: DeckStore["decks"] = new Map();

    const data = JSON.parse(content) as DeckStoreDisk;
    for(const [deckName, deck] of Object.entries(data.decks)) {
        decks.set(
            deckName, 
            { cards: readCards(database, deck.cards) }
        );
    }

    return { decks };
}

function readCards(database: Record<string, Card>, cards: Record<string, EntryProperties>): Map<Card, EntryProperties> {
    return new Map(
        Object.entries(cards)
            .map(([uid, props]): CardWithProps => {
                const card = database[uid];
                if (!card) console.warn(`Unhandled UID: ${card}`);
                return [card, props];
            })
            .filter(([card, _]) => !!card)
    )
}