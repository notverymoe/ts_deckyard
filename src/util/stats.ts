// // Copyright 2026 Natalie Baker // AGPLv3 // //

import type { CardAtomicFile } from "../mtgjson/types";
import { parseSymbolsCostOnly } from "../components/symbols";

export function collectAllCostSymbols(db: CardAtomicFile) {
    const costs: Record<string, string[]> = {};

    for(const faces of Object.values(db.data)) {
        for(const face of faces) {
            const name = face.faceName ?? face.name;

            for (const value of parseSymbolsCostOnly(face.manaCost ?? "")) {
                for(const symbol of value) {
                    costs[symbol] = (costs[symbol] ?? []); 
                    if (!(name in costs[symbol])) {
                        costs[symbol].push(face.name);
                    }
                }
            }

            for (const value of parseSymbolsCostOnly(face.text ?? "")) {
                for(const symbol of value) {
                    costs[symbol] = (costs[symbol] ?? []); 
                    if (!(name in costs[symbol])) {
                        costs[symbol].push(face.name);
                    }
                }
            }

        }
    }

    return costs;
}


export function reportAllCostSymbols(db: CardAtomicFile) {
    const costs = collectAllCostSymbols(db);

    console.log("Unique Symbols: " + Object.keys(costs).map(v => `"${v}"`).join(" | "));

    for(const [cost, cards] of Object.entries(costs).sort(([_a, a], [_b, b]) => b.length - a.length)) {
        console.log(`${cost} - ${cards.length}`);
        console.log(cards);
    }

    return costs;
}

