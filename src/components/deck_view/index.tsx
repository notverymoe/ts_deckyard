// // Copyright 2026 Natalie Baker // AGPLv3 // //

import "./deck_view.css";

import { useCallback, useMemo } from "preact/hooks";
import { DeckViewStoreActions, type DeckView, type DeckViewStore } from "./store";
import type { DeckStore, DeckStoreActions, EntryProperties } from "../../decks/context";
import { useMemoStable } from "../../preact/use_memo_stable";
import type { Card } from "../../mtgjson/database";
import { joinClassNames } from "../../preact/class_names";
import { CardText } from "../card_text";
import { CardList } from "../card_list";
import { Toolbar } from "../toolbar";
import { Form, InputGroup } from "react-bootstrap";
import { useSearchIndex } from "../../search";

export function DeckViewMemoized({index, deckViews, deckViewActions, deckStore, deckStoreActions}: {
    index: number,

    deckViews: DeckViewStore,
    deckViewActions: DeckViewStoreActions,

    deckStore: DeckStore, 
    deckStoreActions: DeckStoreActions,
}) {
    const view: DeckView | undefined = deckViews.views[index];

    const deckOptions = useMemoStable(() => Array.from(deckStore.decks.keys()), [deckStore]);

    const deck = view.selectedDeck ? deckStore.decks.get(view.selectedDeck) : undefined; 
    const deckFiltered = useMemoStable(() => {
        if (!view.viewFilter) return Array.from(deck?.cards.entries() ?? []);
        if (deck) return Array.from(view.viewFilter(deck.cards.entries()));
        return [];
    }, [deck, view.viewFilter]);

    const isActive = deckViews.activeView === index;

    const element = useMemo(
        () => deck ? <DeckViewColumn

            index={index}
            isActive={isActive}

            deckOptions={deckOptions}

            deckView={view}
            deckViewActions={deckViewActions}

            cards={deckFiltered}
            deckStoreActions={deckStoreActions}

        /> : undefined,
        [index, isActive, deckOptions, view, deckViewActions, deckFiltered, deckStoreActions]
    );

    return <div class="deck-view-column-container">{element}</div>;
}

export function DeckViewColumn({index, isActive, deckOptions, deckView, deckViewActions, cards, deckStoreActions}: {
    index: number,
    isActive: boolean,

    deckOptions: string[],

    deckView: DeckView,
    deckViewActions: DeckViewStoreActions,

    cards: [Card, EntryProperties][],
    deckStoreActions: DeckStoreActions,
}) {
    const searchIndex = useSearchIndex();

    const selectedCard = deckView.selectedCard;
    const setSelected = useCallback(
        (card: Card | null) => deckViewActions.setSelectedCard(index, card), 
        [index, deckViewActions]
    );
    const changeDeckTo = useCallback(
        (deck: string) => deckViewActions.setSelectedDeck(index, deck), 
        [deckView.selectedDeck, deckViewActions]
    );

    return <div 
        class={joinClassNames(["deck-view-column", isActive && "active"])}
        onClick={() => deckViewActions.setActive(index)}
    >
        <div class="deck-view-column-header">
            <DeckSelector 
                item={deckView.selectedDeck ?? ""} 
                setItem={changeDeckTo}
                items={deckOptions}
            />
            <Form.Control
                type="text"
                onChange={ev => {
                    const term = ev.currentTarget.value.trim();
                    const results = searchIndex.search(term, {merge: true}).map(v => v.id);
                    
                    if (term.length <= 0) {
                        deckViewActions.setViewFilter(index, null);
                    } else {
                        deckViewActions.setViewFilter(index, function*(cards) {
                            for(const entry of cards) {
                                if(results.includes(entry[0].uid)) yield entry;
                            }
                        })
                    }
                    
                }}
            />
        </div>
        <div class="deck-view-column-deck">
            <div class="deck-view-column-deck-toolbar">
                <Toolbar
                    source={deckView.selectedDeck}
                    action={deckStoreActions}
                    selected={selectedCard}
                />
            </div>
            <div class="deck-view-column-deck-container">
                <CardList 
                    cards={cards} 
                    selected={selectedCard}
                    setSelected={setSelected} 
                />
            </div>
        </div>
        <div class="deck-view-column-info">
            {selectedCard && <CardText card={selectedCard}/>}
        </div>
    </div>;
}

function DeckSelector({
    item,
    items,
    setItem,
}: {
    item: string,
    items: string[],
    setItem: (id: string) => void,
}) {
    return <InputGroup size="lg">
        <InputGroup.Text>View</InputGroup.Text>
        <Form.Select value={item} onChange={ev => setItem(ev.currentTarget.value)}>
            {items.map(id => <option id={id} value={id}>{id}</option>)}
        </Form.Select>
    </InputGroup>
}
