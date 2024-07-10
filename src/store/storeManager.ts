import { create, createStore, Mutate, StateCreator, StoreApi, StoreMutatorIdentifier, UseBoundStore } from "zustand";





/**
 * 这是一个简单的manager，用于管理多个store
 */


class StoreManager {
    private static storeMap = new Map();
    private static _key: number = 0;
    private static getNextKey(): string {
        return 'i_' + (this._key++);
    }

    static create<S, Mos extends [StoreMutatorIdentifier, unknown][]>(state: StateCreator<S, [], Mos>, key?: string): UseBoundStore<Mutate<StoreApi<S>, Mos>> {
        if (key && this.get(key))
            return this.get(key)
        const _key = key || this.getNextKey();
        const store = create(state);
        this.storeMap.set(_key, store);
        return store;
    }

    static get(key?: string) {
        return this.storeMap.get(key);
    }

    static destroy(key: string): void {
        const store = this.storeMap.get(key);
        if (store) {
            this.storeMap.delete(key);
        }
    }
}

export default StoreManager;