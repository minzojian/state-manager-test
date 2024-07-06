import { create } from 'zustand'
import { combine, devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

//这里用到了好几个middleware，combine是用来合并多个store的，devtools是用来调试的，persist是用来持久化的，subscribeWithSelector是用来允许订阅store中局部字段的.immer是用来处理不可变数据的

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

export const useToDoListStore = create(
    subscribeWithSelector(
        devtools(
            persist(
                immer(
                    combine<ToDoListStoreState, ToDoListStoreActions>(
                        { list: [] },
                        (set) => ({
                            // add: (data) => set((state) => ({ list: [...state.list, data] })),
                            // removeAt: (index) => set((state) => ({ list: state.list.filter((_, i) => i !== index) })),
                            // updateAt: (index, newData) => set((state) => ({ list: state.list.map((item, i) => i === index ? newData : item) })),
                            add: (data) => set((state) => {
                                const _data = { task: data, createAt: new Date().getTime() }
                                state.list.push(_data)
                                return state
                            }),
                            removeAt: (index) => set((state) => {
                                state.list.splice(index, 1)
                                return state
                            }),
                            updateAt: (index, newData) => set((state) => {
                                state.list[index] = { ...state.list[index], ...newData }
                                return state
                            })
                        })
                    )
                )
                , { name: "my-list-store" }
            )
        )
    )
)


window['useListStore'] = useToDoListStore