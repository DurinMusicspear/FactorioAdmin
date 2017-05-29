import { BindingEngine } from "aurelia-framework";
import { inject } from 'aurelia-framework';

@inject(BindingEngine)
export class DeepObserver {

    constructor(bindingEngine) {
        this._bindingEngine = bindingEngine;
    }

    observe(target, property, callback) {
        var subscriptions = { root: null, children: [] };

        subscriptions.root = (this._bindingEngine.propertyObserver(target, property)
            .subscribe((n, o) => {
                this.disconnect(subscriptions.children);
                let path = property;
                this.recurse(target, property, subscriptions.children, callback, path);
            })
        );
        return () => { this.disconnect(subscriptions.children); subscriptions.root.dispose(); }
    }

    disconnect(subscriptions) {
        while (subscriptions.length) {
            subscriptions.pop().dispose();
        }
    }

    recurse(target, property, subscriptions, callback, path) {
        let sub = target[property];
        if (typeof sub === "object") {
            for (var p in sub)
                if (sub.hasOwnProperty(p)) {
                    this.recurse(sub, p, subscriptions, callback, `${path}${sub instanceof Array ? '[' + p + ']' : '.' + p}`);
                }
        }

        if (target != property) // Avoid re-observice root node
        {
            subscriptions.push(this._bindingEngine.propertyObserver(target, property).subscribe((n, o) => callback(n, o, path)));
        }
    }
}
