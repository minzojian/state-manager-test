import { createStore, getDefaultStore } from 'jotai/vanilla';


export type Store = ReturnType<typeof createStore> | ReturnType<typeof getDefaultStore>;

type StoreMap = Map<string, Store>;


/**
 * 这是一个简单的manager，用于管理多个store
 * 通过get方法获取store，通过destroy方法销毁store
 * get方法接受一个key和createWhenNull，如果没有key，返回默认store。如果createWhenNull为true，当store不存在时，会创建一个新的store
 */


class StoreManager {
    private static storeMap: StoreMap = new Map();


    static get(key?: string, createWhenNull: boolean = true): Store {
        if (!key)
            return getDefaultStore()
        let store = this.storeMap.get(key);
        if (!store) {
            if (createWhenNull) {
                store = createStore();
                this.storeMap.set(key, store);
            } else {
                return null;
            }
        }
        return store;
    }

    static destroy(key: string): void {
        const store = this.storeMap.get(key);
        if (store) {
            this.storeMap.delete(key);
        }
    }
}

export default StoreManager;