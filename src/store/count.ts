import { atom } from "jotai"
import { useCustomStore } from "./useCustomStore"
import { useEffect } from "react"

const count = atom(0)

/**
 * 这里定义了一个简单的计数用的store，包含了一个count的atom和一个increase的action
 * @param initialValue 这里提供了一个初始值参数，可以在初始化的时候传入设定初始的count值
 * @param storeKey 这里用来区别维护状态的store。通过这个key可以从StoreManager中获取到不同的store，从而实现不同的状态管理
 * @returns 这里是直接把当前的count值和actions返回了，可以直接使用。当然也可以在组件内部通过store的useAtom来建立连接
 */
export const useCountStore = (initialValue?, storeKey?) => {

    const store = useCustomStore((store) => [{
        count: count
    }, {
        increase: () => store.set(count, (c) => c + 1)
    }], storeKey)

    useEffect(() => {
        store.set(count, initialValue || 0)
    }, [storeKey])
    const [usingAtom] = store.useAtom(count)

    return [usingAtom, store.actions, store];
}
