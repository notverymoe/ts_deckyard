// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { iterFilter } from "../util/stream";

export function joinClassNames(classNames: Iterable<any>) {
    return Array.from(iterFilter(classNames, className => (className != null) && typeof className == "string")).join(" ");
}