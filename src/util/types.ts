// // Copyright 2026 Natalie Baker // AGPLv3 // //

export type RecordValueType<T> = T extends Record<any, infer V> ? V : never;
