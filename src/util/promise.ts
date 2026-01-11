// // Copyright 2026 Natalie Baker // AGPLv3 // //

export class PromiseWrapped<T> extends Promise<T> {

    public resolve!: (value: T | PromiseLike<T>) => void;
    public reject!: (reason?: any) => void;

    constructor(executor?: (
        resolve: (value: T | PromiseLike<T>) => void, 
        reject: (reason?: any) => void
    ) => void) {
        super((resolve, reject) => {
            this.resolve = resolve;
            this.reject  = reject;
            executor?.(resolve, reject);
        });
    }

}

export function yieldFor(ms?: number): Promise<void> {
    const timeout = new PromiseWrapped<void>();
    setTimeout(() => timeout.resolve(), ms);
    return timeout;
}

export function yieldCooperative(): Promise<void> {
    return yieldFor();
}

export class CancellationToken {
    private wasCancelRequested: boolean = false;
    private token: PromiseWrapped<void>;

    constructor() {
        this.token = new PromiseWrapped();
        this.token.finally(() => this.wasCancelRequested = true);
    }

    async yield(ms?: number): Promise<void> {
        await Promise.any([this.token, yieldFor(ms)]);
    }

    promise(): Promise<void> {
        return this.token;
    }

    cancel(reason?: any) {
        this.token.reject(reason ?? new Error("Operation was cancelled"));
    }

    isCancelled() {
        return this.wasCancelRequested;
    }

    throwIfCancelled() {
        if (!this.wasCancelRequested) return;
        throw new Error("Operation was cancelled");
    }
}