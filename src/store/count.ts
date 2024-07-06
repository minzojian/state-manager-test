import { create, createStore, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'



export type CountStore = {
    count: number
    increase: () => void
    removeAllCount: () => void
    updateCount: (newCount: number) => void
}
//这里用create方法定义了一个能够生成CountStore类型的hooks
//create方法返回的对象本身是一个函数，该函数执行时会返回当前状态值，但同时该函数作为对象，也直接被赋予了一些API方法，有setState,getState,subscribe,destory,getInitialState
//注意这里用到了immer这个middleware，immer是用来处理不可变数据的，它会把setState的参数转换成一个函数，这个函数的参数是当前的state，返回值是新的state
export const useCountStore = create(
    immer<CountStore>(
        (set) => ({
            count: 0,
            increase: () => set((state) => ({ count: state.count + 1 })),
            removeAllCount: () => set({ count: 0 }),
            updateCount: (newCount) => set({ count: newCount }),
        })
    )
)



//下边是使用createStore的方式，createStore返回的是一个对象，该对象包含了一些API方法，有getState,setState,subscribe,destroy,getInitialState，并不是直接的state
//下边再通过useCountStore将前边的createStore返回的对象转换成了一个hooks
//这个hooks的使用方式和上边的useCountStore是一样的
//使用createStore的方式，可以更加灵活的控制state的变化，因为createStore返回的是一个对象，可以直接对对象进行操作，而create返回的是一个函数，需要通过函数的参数来进行操作
//同时如果使用环境并不是react，而是其他的框架，那么createStore的方式可能会更加适合，因为不依赖于react的hooks

// export const countStore = createStore<CountStore>((set) => ({
//     count: 0,
//     increase: () => set((state) => {
//         console.log(state, 'sssss')
//         return ({ count: state.count + 1 })
//     }),
//     removeAllCount: () => set({ count: 0 }),
//     updateCount: (newCount) => set({ count: newCount }),
// }))

// export const useCountStore = () => useStore(countStore)