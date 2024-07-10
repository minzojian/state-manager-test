import { Atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useAtomCallback, useHydrateAtoms, useReducerAtom, useResetAtom } from "jotai/utils";
import { useMemo } from "react";
import StoreManager, { Store } from "./storeManager";



export type CustomStore<AT = { [key: string]: Atom<any> }, AC = { [key: string]: (...args) => any }> = {
    get: (atom: Atom<any>) => any
    set: (atom: Atom<any>, value: any) => void
    sub: (atom: Atom<any>, cb: any) => void
    store: Store
    useAtom: (atom: Atom<any>) => any
    useAtomValue: (atom: Atom<any>) => any
    useSetAtom: (atom: Atom<any>) => any
    useResetAtom: (atom: Atom<any>) => any
    useReducerAtom: (anAtom: Atom<any>, reducer: any) => any
    useAtomCallback: (callback: any) => any
    useHydrateAtoms: (atoms: Atom<any>) => any
    atoms: AT
    actions: AC


}

//限定为{[key: string]:function}的MAP类型
type ActionMap = {
    [key: string]: (...args: any[]) => any;
};

type RegisterAtomsFunc<AT, AC> = (store: Store) => [AT, AC]

/**
 * 快速定义自定义store，同时管理多个atom。是一个高阶函数，接受一个函数作为参数，该函数接受一个store作为参数，返回一个数组，数组的第一个元素是一个对象，包含多个atom，第二个元素是一个对象，包含多个action
 * 一些常用的方法和hooks已经封装好，可以通过返回的载体直接调用
 * @param registerAtoms 
 * @param storeKey 这用来标识当前store的key，会去StoreManager那里获取实际的store。如果不传，会返回默认store
 * @returns 一个包含了多个atom和action的载体，以及一些常用的方法和hooks
 */

export const useCustomStore = <AT = { [key: string]: Atom<any> }, AC extends ActionMap = ActionMap>(registerAtoms: RegisterAtomsFunc<AT, AC | ((store: Store) => AC)>, storeKey?: string): CustomStore<AT, AC> => {
    const store = StoreManager.get(storeKey)
    const payload = useMemo(() => {
        const s: any = {};
        s.get = (atom: any) => store.get(atom)
        s.set = (atom: any, value: any) => {
            store.set(atom, value)
        }
        s.sub = (atom: any, cb: any) => {
            store.sub(atom, cb)
        }
        s.store = store
        s.useAtom = (atom: any) => useAtom.call(null, atom, { store: store })
        s.useAtomValue = (atom: any) => useAtomValue.call(null, atom, { store: store })
        s.useSetAtom = (atom: any) => useSetAtom.call(null, atom, { store: store })

        s.useResetAtom = (atom: any) => useResetAtom.call(null, atom, { store: store })
        s.useReducerAtom = (anAtom: any, reducer: any) => useReducerAtom.call(null, anAtom, reducer, { store: store })
        s.useAtomCallback = (callback: any) => useAtomCallback.call(null, callback, { store: store })
        s.useHydrateAtoms = (atoms: any) => useHydrateAtoms.call(null, atoms, { store: store })

        const [atoms, actions] = registerAtoms(store)
        s.atoms = atoms
        s.actions = typeof actions == 'function' ? actions(store) : actions

        return s
    }, [store])
    return payload

}

