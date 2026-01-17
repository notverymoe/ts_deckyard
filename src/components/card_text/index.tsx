// // Copyright 2026 Natalie Baker // AGPLv3 // //

import "./card_text.css";

import { Fragment } from "preact/jsx-runtime";
import { Tab, Tabs } from "react-bootstrap";

import type { Card } from "../../mtgjson/database";
import type { CardAtomic, Rulings } from "../../mtgjson/types";
import { iterMap } from "../../util/stream";
import { useDatabaseEnumInfo } from "../../dbenum";
import { joinClassNames } from "../../preact/class_names";

import { parseSymbols, SymbolSet, SymbolSetCards } from "../symbols";

export function CardText({card}: {card: Card}) {
    return <div className="card-text-container">
        <Tabs
            defaultActiveKey="text"
            onKeyDownCapture={ev => {
                // Prevent keydown hijacking
                ev.stopImmediatePropagation();
            }}
            justify
        >   
            <Tab eventKey="text" title="Text">
                {card.faces.map((face, i) => <CardTextFace key={i} face={face}/>)}
            </Tab>
            <Tab eventKey="legality" title="Legality">
                <CardLegality legalities={card.faces[0].legalities}/>
            </Tab>
            <Tab eventKey="errata" title="Errata" disabled={!card.faces[0].rulings}> 
                {card.faces[0].rulings 
                    ? <CardErrata rulings={card.faces[0].rulings}/>
                    : <>No Errata</>}
            </Tab>
        </Tabs>
    </div>;
}

export function CardLegality({legalities}: {legalities: Record<string, string>}) {
    const dbEnumInfo = useDatabaseEnumInfo();

    return <div className="card-text-section">
        <div className="card-text-legality">
            <div className="entry format title">Format</div>
            <div className="entry status title">Legality</div>
            <div className="entry format title">Format</div>
            <div className="entry status title">Legality</div>
            {dbEnumInfo.legalities.map(v => <Fragment key={v.name}>
                <div className="entry format" title={v.name}>{v.name}</div>
                <div className={joinClassNames([
                        "entry status", 
                        (legalities[v.key] ?? "banned").toLowerCase()
                    ])}
                >{legalities[v.key] ?? "Banned"}</div>
            </Fragment>)}
        </div>
    </div>;
}

export function CardErrata({rulings}: {rulings: Rulings[]}) {
    return <div className="card-text-section">
        <div className="card-text-errata">
            {rulings.map(v => <>
                <div>{v.date}</div>
                <div>{Array.from(iterMap(
                    parseSymbols(v.text), 
                    v => v[0] === "text"
                        ? <>{v[1]}</>
                        : <span className="card-text-face-symbols">
                            <SymbolSet symbols={v[1]}/>
                        </span>
                ))}</div>
            </>)}
        </div>
    </div>;
}

export function CardTextFace({face}: {face: CardAtomic}) {

    const name = face.faceName ?? face.name;

    const lines = face.text?.split("\n") ?? [];

    return <div className="card-text-section">
        <div className="card-text-face-title">
            <div title={name} className="card-text-face-title-name">
                {name}
            </div>
            {face.manaCost && <div title={face.manaCost} className="card-text-face-title-cost">
                <SymbolSetCards costs={[face.manaCost]}/>
            </div>}
        </div>
        
        <div className="card-text-face-subtitle">
            <div className="card-text-face-type" title={face.type}>{face.type}</div>
            {(face.power != null || face.toughness != null) && 
                <div className="card-text-face-stats">
                    {face.power ?? "?"}/{face.toughness ?? "?"}
                </div>
            }
        </div>

        <div className="card-text-face-rule-container">
            {lines.flatMap(line => <div 
                title={face.text} 
                className="card-text-face-rule"
            >{
                Array.from(iterMap(
                    parseSymbols(line), 
                    v => v[0] === "text"
                        ? <>{v[1]}</>
                        : <span className="card-text-face-symbols">
                            <SymbolSet symbols={v[1]}/>
                        </span>
                ))
            }
            </div>)} 
        </div>
    </div>;
}