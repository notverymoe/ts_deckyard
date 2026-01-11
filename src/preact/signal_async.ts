// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { Signal, signal } from "@preact/signals";

/** The status of the promise. */
export type AsyncStatus<T> = AsyncStatusSuccess<T> | AsyncStatusFailure | AsyncStatusIncomplete;

/** An async status waiting for its promise to resolve */
export type AsyncStatusIncomplete = { completed: false, };

/** An async status that completed sucessfully */
export type AsyncStatusSuccess<T> = { completed: true, value: T, };

/** An async status that completed unsucessfully */
export type AsyncStatusFailure = { completed: true, error: unknown, };

/**
 * Signal that wraps a promise, reporting if its complete,
 * the resolved value or the caught error on failure.
 */
export function signalAsync<T>(promise: Promise<T>): Signal<AsyncStatus<T>> {
    const result = signal<AsyncStatus<T>>({completed: false});
    promise
        .then( value => result.value = {completed: true, value})
        .catch(error => result.value = {completed: true, error});
    return result;
}

/**
 * Returns if the given status has completed and resulted
 * in a success.
 */
export function isAsyncStatusSuccess<T>(status: AsyncStatus<T>): status is AsyncStatusSuccess<T> {
    return status.completed && "value" in status;
}

/**
 * Returns if the given status has completed and resulted
 * in an error.
 */
export function isAsyncStatusFailure<T>(status: AsyncStatus<T>): status is AsyncStatusFailure {
    return status.completed && "error" in status;
}

/**
 * Helper function to transform the async status into a
 * single value (ie. fragment).
 */
export function handleAsyncStatus<T, R>(
    status: AsyncStatus<T>,
    loading: () => R,
    success: (v: T) => R,
    error:   (e: unknown) => R,
) {
    if (isAsyncStatusSuccess(status)) return success(status.value);
    if (isAsyncStatusFailure(status)) return error(status.error);
    return loading();
}