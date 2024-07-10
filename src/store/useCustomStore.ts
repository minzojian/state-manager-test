import { useMemo } from "react";
import { Mutate, StateCreator, StoreApi, StoreMutatorIdentifier, UseBoundStore } from "zustand";
import StoreManager from "./storeManager";




/**
 * 快速定义自定义store
 * @param registerAtoms 这个方法返回了当前需要被注册的state。其中有state的初始化，以及一些操作state的方法
 * @param selector 选择器，用于选择需要的state，如果不传，会返回全部state
 * @param storeKey 这用来标识当前store的key，会去StoreManager那里获取实际的store。如果不传，会自动生成一个key
 * @returns 返回当前的state和包含了API的store。这里的store是一个函数，执行时会返回当前的state。它同时包含了一些API。这个store是在StoreManager中通过createb函数生成的
 */

export const useCustomStore = <S, Mos extends [StoreMutatorIdentifier, unknown][]>(registerAtoms: () => StateCreator<S, [], Mos>, selector?: (state: S) => Partial<S> | S, storeKey?: string): [
    Partial<S> | S, UseBoundStore<Mutate<StoreApi<S>, Mos>>
] => {
    const store = useMemo(() => {
        const initializer = registerAtoms();
        const store = StoreManager.create(initializer, storeKey)
        return store
    }, [storeKey])
    const state = store(selector || ((i: S) => (i)));
    return [state, store]
}

