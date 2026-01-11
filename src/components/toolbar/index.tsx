// // Copyright 2026 Natalie Baker // AGPLv3 // //

import type { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import { Button, ButtonGroup } from "react-bootstrap";
import type { DeckStoreActions } from "../../decks/context";
import type { Card } from "../../mtgjson/database";

export function Toolbar({source, action, selected}: {
    source: string | undefined | null,
    action: DeckStoreActions,
    selected: Card | undefined | null,
}) {
    return <>
        <ButtonGroup vertical>
            <ButtonMoveToDeck
                source={source}
                target="Mainboard"
                action={action}
                selected={selected}
            >M</ButtonMoveToDeck>
            <ButtonMoveToDeck
                source={source}
                target="Sideboard"
                action={action}
                selected={selected}
            >S</ButtonMoveToDeck>
            <ButtonMoveToDeck
                source={source}
                target="Considerboard"
                action={action}
                selected={selected}
            >C</ButtonMoveToDeck>
        </ButtonGroup>

        <hr/>

        {source !== "Database" && <ButtonGroup vertical>
            <ButtonModifyQty
                source={source}
                action={action}
                selected={selected}
                modify={qty => qty + 1}
            >+</ButtonModifyQty>
            <ButtonModifyQty
                source={source}
                action={action}
                selected={selected}
                modify={_qty => 4}
            >4</ButtonModifyQty>
            <ButtonModifyQty
                source={source}
                action={action}
                selected={selected}
                modify={_qty => 4}
            >1</ButtonModifyQty>
            <ButtonModifyQty
                source={source}
                action={action}
                selected={selected}
                modify={qty => qty - 1}
            >-</ButtonModifyQty>
        </ButtonGroup>}
    </>;
}

function ButtonModifyQty({source, action, selected, modify, children}: {
    source: string | undefined | null, 
    action: DeckStoreActions,
    selected:  Card | undefined | null, 
    modify: (v: number) => number,
    children?: ComponentChildren,
}) {
    return <Button
        disabled={!selected}
        onClick={() => {
            if (!selected || !source) return;
            action.cardModify(source, selected, e => {
                if (e.qty === undefined) return;
                e.qty = modify(e.qty!);
            });
        }}
    >{children}</Button>
}

function ButtonMoveToDeck({source, target, selected, action, children}: {
    source:    string | undefined | null, 
    target:    string, 
    selected:  Card | undefined | null, 
    action:    DeckStoreActions,
    children?: ComponentChildren,
}) {

    const error = useMemo(
        () => [
            !selected ? "Cannot move. No card selected" : undefined,
            source === target ? "Cannot move. Source and Destination are the same." : undefined,
        ].filter(v => !!v)[0] ?? undefined, 
        [source, target, selected]
    );

    return <Button 
        disabled={!!error}
        title={error ? error : `Send to ${target}`}
        onClick={_ev => {
            if (!selected || !source) return;
            action.cardTransfer(target, source, selected);
            //deckStoreActions.cardSelect(target, selectedCard);
        }}
    >{children}</Button>
}