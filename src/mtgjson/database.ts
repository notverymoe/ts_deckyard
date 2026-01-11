// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { loadAtomicCards } from "./atomic_cards";
import type { CardAtomicFile, CardAtomic } from "./types";

export type CardsByUID = Record<string, Card>;

export type Card = { 
    /** 
     * The unique id of the card. 
     * Generally the scryfall oracle id, but falls back to the card's full name if it's somehow missing.
     **/
    uid: string, 

    /**
     * The full name of the card
     */
    name: string,

    /**
     * The faces on the card
     */
    faces: CardAtomic[] 
};

/**
 * Loads the mtgjson atomic card file database and transforms it to
 * be key-ed by a UID, this is necessary to disambiguate cards with
 * identical names. Subsequent calls will return the same promise,
 * unless an error occured in which case a new attempt will be started and returned.
 */
export function loadCardsByUID(): Promise<CardsByUID> {
    if(!cardsByUIDPromise) {
        cardsByUIDPromise = doLoadCardsByUID();
        cardsByUIDPromise.catch(() => cardsByUIDPromise = undefined);
    }
    return cardsByUIDPromise!;
}

/**
 * Cached promise.
 * Note: Should be the bare promise returned from the async call.
 */
let cardsByUIDPromise: Promise<CardsByUID> | undefined = undefined;

async function doLoadCardsByUID() {
    const atomicCards = await loadAtomicCards();
    return transformCardAtomicFile(atomicCards);
}

/**
 * We need to take the by-name organized card-face-lists and transform them
 * into by-uid organized card-face-lists. This is because some cards have
 * been released in events with similar names to eachother, and some un-sets
 * contain cards with different text that're merged into one atomic card. 
 * 
 * After this transformation, the store will be organized by uid and each
 * card entry should represent a single real card identity.
 */
export function transformCardAtomicFile(byName: CardAtomicFile): CardsByUID {
    return groupBy(
        Object.values(byName.data).flatMap(faces => faces), 
        getUID,
        (dest, face) => {
            dest = dest ?? {uid: getUID(face), name: face.name, faces: []};
            dest.faces.push(face);
            return dest;
        }
    );
}

/**
 * Sorts an iterable into a record using a predicate that returns the string key, storing all values for a key in an array.
 */
function groupBy<T, D>(
    iterable: Iterable<T>, 
    predictate: (v: T) => string,
    update: (dest: D | undefined, v: T) => D,
): Record<string, D> {
    const result: Record<string, D> = {};
    for(const item of iterable) {
        const k = predictate(item);
        result[k] = update(result[k], item);
    }
    return result;
}

function getUID(face: CardAtomic) {
    return face.identifiers.scryfallOracleId ?? face.name;
}