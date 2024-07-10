
import { atom } from "jotai"
import { useCustomStore } from "./useCustomStore"
import { useEffect } from "react"

export type ToListItem = {
    task: string
    done?: boolean
    createAt: number
}

export type ToDoListStoreState = {
    list: ToListItem[]
}
export type ToDoListStoreActions = {
    add: (data: string) => void
    removeAt: (index: number) => void
    updateAt: (index: number, newData: Partial<ToListItem>) => void
}

const listAtom = atom<ToListItem[]>([])
// 这里定义了一个doneCount的atom，用于统计已完成的任务数量,是listAtom的派生原子
const doneCountAtom = atom((get) => {
    return get(listAtom).filter(item => item.done).length
})

/**
 * 这里实现了一个简单的todo list store，包含了一个list的atom和add、removeAt、updateAt三个action
 * 因为被操作的对象是一个array，要注意引用的问题，如果直接修改原来的对象，可能会导致不会触发更新。
 * @param initialValue 
 * @param storeKey 
 * @returns 这里返回了一个包含了list值和actions的载体，以及store本身。如果需要获取doneCount的值，可以通过store的useAtom来获取
 */
export const useToDoListStore = (initialValue?, storeKey?) => {

    const store = useCustomStore(
        (store) => [{ list: listAtom, doneCount: doneCountAtom },
        {
            add: (data) => store.set(listAtom, (listValue) => {
                const _data = { task: data, createAt: new Date().getTime() }
                return [...listValue, _data]
            }),
            removeAt: (index) => store.set(listAtom, (listValue) => {
                return listValue.filter((_, i) => i !== index)
            }),
            updateAt: (index, newData) => store.set(listAtom, (listValue) => {
                return listValue.map((item, i) => {
                    if (i === index) {
                        return { ...item, ...newData }
                    }
                    return item
                })
            })
        }
        ], storeKey
    )
    useEffect(() => {
        store.set(listAtom, initialValue || [])
    }, [storeKey])

    const [usingAtom] = store.useAtom(listAtom)

    return [usingAtom, store.actions, store];
}
