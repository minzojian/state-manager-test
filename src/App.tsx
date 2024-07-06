import "./App.css";

import { useEffect } from "react";
import { useCountStore } from "./store/count";
// import {useCountStore, countStore } from "./store/count";
import { useToDoListStore } from "./store/toDoList";

function App() {
  const { count, increase } = useCountStore();
  const { list, add, removeAt, updateAt } = useToDoListStore();
  console.log(useCountStore.setState);
  useEffect(() => {
    return useToDoListStore.subscribe(
      (state) => state.list,
      (next, prev) => {
        useCountStore.setState((state) => {
          state.count = next.filter(({ done }) => done).length;
          return state;
        });
        //下边这种方式也是可以的。在没有使用immer的情况下，直接返回一个新的对象，该对象会和旧对象的值进行合并。第二个参数replace表示是否完全替换旧对象，即不合并
        // useCountStore.setState({
        //   count: next.filter(({ done }) => done).length,
        // });
        //这种是采用countStore的setState来更新的方式
        // countStore.setState({ count: next.filter(({ done }) => done).length });
      }
    );
  }, []);

  return (
    <>
      <h1>state manage test</h1>
      <div className="card">
        <button onClick={increase}>count is {count}</button>
        <button onClick={() => add("" + Math.random())}>
          add random number task into todo list
        </button>

        <div>Done Task:{count}</div>
        {list.map((item, index) => (
          <div key={index}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => updateAt(index, { done: !item.done })}
              />
              {item.done ? (
                <s>
                  {index}:{item.task}
                </s>
              ) : (
                <>
                  {index}:{item.task}
                </>
              )}
              <button onClick={() => removeAt(index)}>Remove</button>
              <button
                onClick={() =>
                  updateAt(index, { task: "updated:" + Math.random() })
                }
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
