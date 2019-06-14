declare class Subscription<T> {
    protected subs: Array<(x: T) => void>;
    subscribe(sub: (x: T) => void): void;
    unsubscribe(sub: (x: T) => void): void;
    notifySubscribers(x: T): void;
}
