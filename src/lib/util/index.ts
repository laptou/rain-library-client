type Selector<T, K> = (t: T) => K;

export function sorter<T, K>(selector: Selector<T, K>): (a: T, b: T) => number {
    return (a, b) => {
        const ka = selector(a), kb = selector(b);
        if (ka < kb) return 1;
        else if (ka === kb) return 0;
        else return -1;
    };
}

export function sort<T, K>(arr: T[], selector: Selector<T, K>): T[] {
    return arr.sort(sorter(selector));
}