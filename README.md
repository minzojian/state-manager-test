*以下内容为个人研究的经验总结，如有谬误或建议，欢迎提issue和PR
# REACT STATE MANAGER TEST - JOTAI

Under this branch is using jotai as the state manager
这个分支下是使用jotai来作为状态管理的载体



jotai强调的是原子化，所谓原子化并不是说要用原始数据类型才能称为原子
也可以针对复杂的对象

jotai的使用常见的操作是 定义atom 和在组件中 useAtom(atom)  
定义的位置可以放在组件外的任何地方  

jotai的atom有原始原子（Primitive Atoms）和派生原子（Derived Atoms）
原始原子是状态的基本构建块。它们直接包含值，这个值可以是任何类型的数据，如字符串、数字、对象等。原始原子的值可以被读取和更新。当原始原子的值发生变化时，依赖于该原子的组件会重新渲染。
```
import { atom } from 'jotai'

// 创建一个原始原子，初始值为0
const countAtom = atom(0)
```
派生原子是基于一个或多个其他原子（原始原子或派生原子）的值计算得到的。它们通过一个纯函数来定义，这个函数接收依赖的原子的值作为参数，并返回一个新的值。派生原子本身不存储状态，它们的值是动态计算出来的。当依赖的原子值发生变化时，派生原子的值也会相应地更新。有点类似vue中的computed属性
```
import { atom } from 'jotai'

// 假设有一个原始原子
const countAtom = atom(0)

// 创建一个派生原子，它的值是原始原子值的两倍
const doubledCountAtom = atom((get) => get(countAtom) * 2)
```
此外，atom的回调除了通过get实现计算属性外，也可通过set来实现只写操作
```
import { atom } from 'jotai'

// 原始原子
const countAtom = atom(0)

// 派生原子，既可读又可写
const adjustedCountAtom = atom(
  // 读取操作：获取原始原子的值并进行调整
  (get) => get(countAtom) + 10, //如果这里的函数设为null,则表示定义仅写
  // 写入操作：接收新的值，并更新原始原子的值
  (get, set, update) => set(countAtom, get(countAtom) + update) //这里的update为执行adjustedCountAtom(update)这样操作该atom时传时的更新值，可以接受多个参数传递
)
```

还有一种用法是创建带初始值的可写原子
```
import { atom } from 'jotai'

// 原始原子
const countAtom = atom(0)

// 定义带初始值的可写原子
const countAtom = atom(
  0, // 初始值
  (get, set, update: number) => set(countAtom, get(countAtom) + update) // 更新函数
);
```

这里这个分支下的测试场景是用到了路由去切换两个页面
在page1页面中，定义了一个counterAtom，以及两个不同的store. 在useAtom的时候，传递了store属性，来指明使用不同的store来管理同一个counterAtom。
尽管counterAtom是同一个，但因为store不同，会独立维护不同的状态，因此下边的两个按钮，点击的计数结果彼此独立。

~~因为这个页面是动态加载的，一般这种页面组件里的内容都是独立不会被外部依赖的。定义在这个页面里的atom一般只在page1的范围内使用。~~




This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
