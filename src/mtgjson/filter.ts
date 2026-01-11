// // Copyright 2026 Natalie Baker // AGPLv3 // //

import type { Card } from "./database";

export function* filterLegalInAnyConstructedFormat(cards: Iterable<Card>) {
    for(const card of cards) {
        if (card.faces.length <= 0) continue;
        const anyNotBanned = !!Object.values(card.faces[0].legalities).find(v => v !== "Banned");
        if(anyNotBanned) yield card;
    }
}

