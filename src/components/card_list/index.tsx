// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { useCallback, useMemo } from "preact/hooks";

import type { EntryProperties } from "../../decks/context";
import type { Card } from "../../mtgjson/database";
import { VirtualList } from "../../preact/virtual_list";
import { rootLineHeightToPixels } from "../../util/size";

import { CardRow } from "../card_row";

export function CardList({cards, selected, setSelected}: {
    cards: [Card, EntryProperties][],
    selected: Card | undefined | null,
    setSelected: (card: Card) => void,
}) {

    const selectedCardIndex = useMemo(
        () => {
            if (!selected) return -1;
            const index = cards.findIndex(([k, _]) => k === selected);
            if (index < 0) return -1;
            return index;
        },  
        [cards, selected]
    );

    const setSelectedCardIndex = useCallback(
        (index: number) => {
            if ((index < 0) || (index >= cards.length)) return;
            const card = cards[index]?.[0];
            setSelected(card);
        }, 
        [cards, setSelected]
    );

    return <VirtualList
        maxRows={cards.length}
        calculateRowCount={(containerHeight) => {
            const minRowHeight = rootLineHeightToPixels(1.7);
            const rowCount     = Math.floor(containerHeight/minRowHeight);
            return rowCount;
        }}
        setSelectedIndex={setSelectedCardIndex}
        selectedIndex={selectedCardIndex}
        renderRowRange={(start, length, selectedCardIndex) => {
            return <>{Array.from({length}, (_, i) => {
                const idx = i + start;
                const [card, cardData] = cards[idx];
                const isSelected = selectedCardIndex === idx;
                return <CardRow
                    key={idx}
                    card={card} 
                    count={cardData.qty}
                    select={() => setSelected(card)}
                    isSelected={isSelected}
                />;
            })}</>;
        }}
    />;
}