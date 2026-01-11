// // Copyright 2026 Natalie Baker // AGPLv3 // //

import URL_ATOMIC_CARDS from "/mtgjson/AtomicCards.json.gz?url";

import type { CardAtomicFile } from "./types";

/**
 * Loads the mtgjson atomic card file database. Subsequent
 * calls will return the same promise, unless an error occured
 * in which case a new attempt will be started and returned.
 */
export function loadAtomicCards(): Promise<CardAtomicFile> {
    if(!atomicCardsPromise) {
        atomicCardsPromise = doLoadAtomicCardsFromFile();
        atomicCardsPromise.catch(() => atomicCardsPromise = undefined);
    }
    return atomicCardsPromise!;
}

/**
 * Cached promise.
 * Note: Should be the bare promise returned from the async call.
 */
let atomicCardsPromise: Promise<CardAtomicFile> | undefined = undefined;

async function doLoadAtomicCardsFromFile(): Promise<CardAtomicFile> {
    let response = await fetch(URL_ATOMIC_CARDS);
    if (response.headers.get("Content-Type") == "application/gzip") {
        // HACK Vite serves gz files as encoding-type, Python serves it raw
        const stream = response.body?.pipeThrough(new DecompressionStream('gzip'));
        response = new Response(stream);
    }
    return await response.json();
}