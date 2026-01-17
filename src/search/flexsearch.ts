// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { Document, Encoder } from "flexsearch";

import type { Card } from "../mtgjson/database";

export function createCardSearchIndex(cards: Card[]): Document<any> {

    const index = new Document<Card>({
        id: "uid",
        index: [
            { 
                field: "name" 
            },
            { 
                field: "manaCost", 
                custom: (card: Card) =>  card.faces[0].manaCost ?? ""
            },
            {
                field: "text",
                custom: (card: Card) => card.faces.map(face => face.text).join("\n\n")
            },
            {
                field: "type",
                custom: (card: Card) => card.faces.map(face => face.type).join("\n\n")
            },
            {
                field: "rulings", 
                custom: (card: Card) => card.faces[0].rulings?.map(v => v.text).join("\n\n") ?? ""
            },
        ],
        tokenize: "forward",
        encoder: new Encoder({
            dedupe: false,
            normalize: true,
            cache: true,
            include: {
                letter: true,
                number: true,
                symbol: false,
                punctuation: false,
                control: false,
                char: ["{",  "}", "/", "+", "-"]
            }
        }),
        resolution: 5,
        
    });

    cards.forEach(card => index.add(card));

    return index;
}