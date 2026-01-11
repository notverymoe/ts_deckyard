// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { nothing, isDraft, original } from "immer";

export type ImmerReturn<S> = void | (S extends undefined ? typeof nothing : S);

export function underlying<S>(v: S): S {
    return isDraft(v) ? original(v)! : v;
}