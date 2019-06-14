"use strict";
class Subscription {
    constructor() {
        this.subs = [];
    }
    subscribe(sub) {
        this.subs.push(sub);
    }
    unsubscribe(sub) {
        const idx = this.subs.indexOf(sub);
        if (idx >= 0) {
            this.subs.splice(idx, 1);
        }
    }
    notifySubscribers(x) {
        this.subs.forEach((sub) => sub(x));
    }
}
//# sourceMappingURL=Subscription.js.map