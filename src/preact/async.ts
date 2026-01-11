// // Copyright 2026 Natalie Baker // AGPLv3 // //

import { useEffect, useState, type Inputs } from "preact/hooks";
import type { AsyncStatus, AsyncStatusFailure } from "./signal_async";
import { CancellationToken } from "../util/promise";

export type Cancellable<T> = T & {
    token: CancellationToken | null
};

export type AsyncStatusCancellable<T> = Cancellable<AsyncStatus<T>>

export function isAsyncStatusCancelled<T>(status: AsyncStatusCancellable<T>): status is Cancellable<AsyncStatusFailure> {
    return status.completed && "error" in status && !!status.token?.isCancelled();
}

export function useAsync<T>(op: (token: CancellationToken) => Promise<T>, deps: Inputs): AsyncStatus<T> {

    const [status, setStatus] = useState<AsyncStatusCancellable<T>>({
        completed: false, 
        token: null
    });

    useEffect(() => {
        const token = new CancellationToken();

        setStatus({
            completed: false, 
            token,
        });

        const promise = op(token);
        if (token.isCancelled()) {
            setStatus({
                completed: true, 
                error: new Error("Operation was cancelled"),
                token, 
            });
            return;
        }

        promise
            .then(value => {
                // TODO needs some way to skip this if source hook state no longer exists
                setStatus(status => {
                    if (status.token !== token) return status; // Not the same token? Discard.
                    if (token.isCancelled()) {
                        // If cancelled, then artifically discard the value.
                        return {completed: true, error: new Error("Operation was cancelled"), token};
                    } else {
                        return {completed: true, value, token};
                    }
                });
            })
            .catch(error => {
                // TODO needs some way to skip this if source hook state no longer exists
                setStatus(status => {
                    if (status.token !== token) return status; // Not the same token? Discard.
                    return {completed: true, error, token};
                });
            });

        return () => token.cancel();
    }, deps);

    return status;

}