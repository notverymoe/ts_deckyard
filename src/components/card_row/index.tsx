// // Copyright 2026 Natalie Baker // AGPLv3 // //

import "./card_row.css"

import { useMemo } from "preact/hooks";

import type { Card } from "../../mtgjson/database";
import { SymbolSetCards } from "../symbols";
import { joinClassNames } from "../../preact/class_names";

export function CardRow({card, count, isSelected, select}: {card: Card, count?: number | null, isSelected: boolean, select: () => void}) {    
    const costSymbols = useMemo(() => <SymbolSetCards costs={card.faces.map(face => face.manaCost ?? "")}/>, [card]);

    return <div className={joinClassNames(["btn-secondary card-row", isSelected && "selected"])} onClick={select}>
        {count != null && <div className="count">{count}</div>}
        <div className="name" title={card.name}>{card.name}</div>
        <div className="cost">{costSymbols}</div>
    </div>;
}