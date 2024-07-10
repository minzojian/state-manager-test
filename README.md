*以下内容为个人研究的经验总结，如有谬误或建议，欢迎提issue和PR
# REACT STATE MANAGER TEST - ZUSTAND

Under this branch is using zustand as the state manager
这个分支下是使用zustand来作为状态管理的载体

Zustand means "state" in German.

用法由create方法来创建一个获取状态对象的hooks
例如  
```
const useCountStore = create((set) => ({
count: 0,
increase: () => set((state) => ({ count: state.count + 1 })),
removeAllCount: () => set({ count: 0 }),
updateCount: (newCount) => set({ count: newCount }),
}))
```

create方法接受一个回调函数，并传递参数为(set,get,api)三个参数。回调函数返回状态以及可用于改变状态的一些action方法。  
set即为setState  
get即为getState  
api是所有可用方法的map  
方法有`getInitialState`,`getState`,`setState`,`subscribe`,`destory`这样几个


create返回的是一个函数(selector,equalityFn)=>State  
如果不指明selector，则返回的是整个状态  
例如 
``` 
const {count}=useCountStore()  
```
或者只返回状态里的部分值，如  
```
const  count= useCountStore((state)=>state.count) 
```
equalityFn是一个对比函数，用于判断状态的前后值是否一致。只有在不一致的时候，才会触发重绘。以及订阅才会响应。  
比如判断  
```
const  count= useCountStore((state)=>state.count,(prev,next)=>prev==next) 
```

因为create函数接受的是回调函数，也就意味着添加中间件很自然而然  
比如  
```
const useCountStore = create(
        persist((set) => ({count: 0}),
        {name:”my-count-store”}
    )
```
官方的中间件有  
immer 因为zustand维护的状态值也是不可变状态，所以每次更新都要返回全量的状态对象回去。为了方便直接更新嵌套的状态字段值，使用immer https://github.com/pmndrs/zustand#sick-of-reducers-and-changing-nested-states-use-immer  
redux 结合现有的redux状态管理使用 https://github.com/pmndrs/zustand#redux-devtools  
devtools  把状态的结果在redux devtools里展示出来 https://github.com/pmndrs/zustand#redux-devtools  
subscribeWithSelector 默认的subscribe方法是监听整个状态的，使用这个中间件，就可以实现第一个参数为selector的方式，监听局部字段的变化。 https://github.com/pmndrs/zustand#using-subscribe-with-selector  
combine 可用来把初始状态和action分开，在typescript中就不必强制指定状态的类型 https://docs.pmnd.rs/zustand/guides/typescript#basic-usage  
persist https://github.com/pmndrs/zustand#persist-middleware  
createJSONStorage 用来创建自定义持久化存储时使用 https://github.com/pmndrs/zustand#persist-middleware  





这里这个分支下的测试场景是用到了路由去切换两个页面


分别用useCustomStore封装了三个不同的自定义store  
useCountStore
一个计数器的状态管理

useToDoListStore
一个todo list的状态管理

usePaginationDataStore
一个分页数据加载的状态管理

useCustomStore的作用是方便管理和区隔不同的状态域

在root页面中，是这三个自定义store的具体使用场景。包含了通暴露出来的action去更新状态，或者是直接通过store.setState这样的方式去更新。以及订阅变化等。


在page1页面中，在组件外定义了一个createCountStore，然后执行了两次分别给到两个store上. 在组件内useStore的时候，传递了store属性，来指明维护独立的计数状态。
然后使用useCountStore也实现了一个类似的计数功能