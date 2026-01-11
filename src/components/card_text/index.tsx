// // Copyright 2026 Natalie Baker // AGPLv3 // //

import "./card_text.css"

import { useMemo } from "preact/hooks";
import type { Card } from "../../mtgjson/database";
import type { CardAtomic } from "../../mtgjson/types";
import { parseSymbols, SymbolSet, SymbolSetCards } from "../symbols";
import { iterMap } from "../../util/stream";

export function CardText({card}: {card: Card}) {
    const parts = useMemo(() => <>
        {card.faces.map((face, i) => <CardTextFace key={i} face={face}/>)}
        {card.faces[0].rulings && <div class="card-text-section">
            <div class="card-text-face-title">
                <div class="card-text-face-title-name">
                    Errata
                </div>
            </div>
            <div class="card-text-errata">
                {card.faces[0].rulings!.map(v => <>
                    <div>{v.date}</div>
                    <div>{Array.from(iterMap(
                        parseSymbols(v.text), 
                        v => v[0] === "text"
                            ? <>{v[1]}</>
                            : <span class="card-text-face-symbols">
                                <SymbolSet symbols={v[1]}/>
                            </span>
                    ))}</div>
                </>)}
            </div>
        </div>}

    </>, [card]);
    return <>{parts}</>;
}

export function CardTextFace({face}: {face: CardAtomic}) {

    const name = face.faceName ?? face.name;

    const lines = face.text?.split("\n") ?? [];

    return <div class="card-text-section">
        <div class="card-text-face-title">
            <div title={name} class="card-text-face-title-name">
                {name}
            </div>
            {face.manaCost && <div title={face.manaCost} class="card-text-face-title-cost">
                <SymbolSetCards costs={[face.manaCost]}/>
            </div>}
        </div>
        
        <div class="card-text-face-subtitle">
            <div class="card-text-face-type" title={face.type}>{face.type}</div>
            {(face.power != null || face.toughness != null) && 
                <div class="card-text-face-stats">
                    {face.power ?? "?"}/{face.toughness ?? "?"}
                </div>
            }
        </div>

        <div class="card-text-face-rule-container">
            {lines.flatMap(line => <div 
                title={face.text} 
                class="card-text-face-rule"
            >{
                Array.from(iterMap(
                    parseSymbols(line), 
                    v => v[0] === "text"
                        ? <>{v[1]}</>
                        : <span class="card-text-face-symbols">
                            <SymbolSet symbols={v[1]}/>
                        </span>
                ))
            }
            </div>)} 
        </div>
    </div>;
}