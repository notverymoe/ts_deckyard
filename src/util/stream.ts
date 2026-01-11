// // Copyright 2026 Natalie Baker // AGPLv3 // //

export function* iterSlice<T>(iter: Iterable<T>, skip?: number, take?: number) {
    const skipCount = skip ?? 0;
    const takeCount = take ?? Number.MAX_SAFE_INTEGER;

    let i = 0;
    for(const item of iter) {
        if (i >= skipCount) {
            if (i-skipCount >= takeCount) return;
            yield item;
        }
        i++;
    }
}

export function* iterMap<T, R>(iter: Iterable<T>, op: (v: T, i: number) => R) {
    let i = 0;
    for(const item of iter) {
        yield op(item, i);
        i++;
    }
}

export function* iterFilter<T>(iter: Iterable<T>, op: (v: T, i: number) => boolean) {
    let i = 0;
    for(const item of iter) {
        if(op(item, i)) { 
            yield item; 
        }
        i++;
    }
}

export function* iterFlatMap<T, R>(iter: Iterable<T>, op: (v: T, i: number) => Iterable<R>) {
    let i = 0;
    for(const item of iter) {
        for(const next of op(item, i)) {
            yield next;
        }
        i++;
    }
}

