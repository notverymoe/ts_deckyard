// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { Document, Encoder } from "flexsearch";
import type { Card } from "../mtgjson/database";

export function createCardSearchIndex(cards: Card[]) {

    const index = new Document({
        id: "uid",
        index: [
            "name",
            "manaCost",
            "faces:text",
            "faces:type",
            "faces:rulings:text",
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
        resolution: 1,
        
    });

    cards.forEach(card => index.add(card));

    return index;
}