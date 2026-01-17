// // Copyright 2026 Natalie Baker // AGPLv3 // //

import "./deck_view.css";

import { Form, InputGroup } from "react-bootstrap";
import { useCallback, useMemo } from "preact/hooks";

import type { DeckStore, DeckStoreActions, EntryProperties } from "../../decks/context";
import { useMemoStable } from "../../preact/use_memo_stable";
import type { Card } from "../../mtgjson/database";
import { joinClassNames } from "../../preact/class_names";

import { CardText } from "../card_text";
import { CardList } from "../card_list";
import { Toolbar } from "../toolbar";

import { DeckViewStoreActions, type DeckView, type DeckViewStore } from "./store";
import { FilterOptions } from "./filter";

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

    return <div className="deck-view-column-container">{element}</div>;
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

    const cardCount = useMemo(
        () => cards.map(([_, p]) => p.qty ?? 1).reduce((p, c) => p + c, 0) ?? 0, 
        [cards]
    );

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
        className={joinClassNames(["deck-view-column", isActive && "active"])}
        onClick={() => deckViewActions.setActive(index)}
    >
        <div className="deck-view-column-header">
            <DeckSelector 
                cardCount={cardCount}
                item={deckView.selectedDeck ?? ""} 
                setItem={changeDeckTo}
                items={deckOptions}
            />
            <FilterOptions
                index={index}
                deckViewActions={deckViewActions}
            />
        </div>
        <div className="deck-view-column-deck">
            <div className="deck-view-column-deck-toolbar">
                <Toolbar
                    source={deckView.selectedDeck}
                    action={deckStoreActions}
                    selected={selectedCard}
                />
            </div>
            <div className="deck-view-column-deck-container">
                <CardList 
                    cards={cards} 
                    selected={selectedCard}
                    setSelected={setSelected} 
                />
            </div>
        </div>
        <div className="deck-view-column-info">
            {selectedCard && <CardText card={selectedCard}/>}
        </div>
    </div>;
}

function DeckSelector({
    cardCount,
    item,
    items,
    setItem,
}: {
    cardCount: number,
    item: string,
    items: string[],
    setItem: (id: string) => void,
}) {
    return <InputGroup size="lg">
        <InputGroup.Text style={{minWidth: "13ch"}}>
            <span style={{width: "100%"}}/>
            {cardCount.toLocaleString()} Cards
        </InputGroup.Text>
        <Form.Select value={item} onChange={ev => setItem(ev.currentTarget.value)}>
            {items.map(id => <option id={id} value={id}>{id}</option>)}
        </Form.Select>
    </InputGroup>
}
