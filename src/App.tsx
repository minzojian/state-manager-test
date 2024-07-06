import "./App.css";

import { useEffect, useMemo } from "react";
import { useCountStore } from "./store/count";
// import { useCountStore, countStore } from "./store/count";
import { useToDoListStore } from "./store/toDoList";
import { createPaginationDataStore } from "./store/paginationData";
import { mockPageDataRequest, TestData } from "./mock/pageDataService";
import { useStore } from "zustand";

function App() {
  const { count, increase } = useCountStore();
  const { list, add, removeAt, updateAt } = useToDoListStore();

  useEffect(() => {
    const unsubscribe = useToDoListStore.subscribe(
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
    return () => unsubscribe();
  }, []);

  //下边是通过useMemo的方式把一个依赖某个请求参数的闭包函数所创建的store缓存起来，这样可以避免在每次渲染的时候都重新创建store。
  //不仅仅是为了提高性能，主要的目的是为了避免store的重复创建，保证它的唯一性
  const paginationDataStore = useMemo(
    () =>
      createPaginationDataStore<TestData>({
        request: mockPageDataRequest,
      }),
    []
  );
  //结合useStore来使用上边缓存起来的store
  const {
    data,
    page,
    total,
    pageSize,
    hasMore,
    hasError,
    isLoading,
    fetchMore,
  } = useStore(paginationDataStore);

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

      <div className="card">
        <h2>pagination data</h2>
        <div>
          <button onClick={fetchMore} disabled={isLoading || !hasMore}>
            {isLoading ? "loading..." : !hasMore ? "no more data" : "load more"}
          </button>
          {page}/{Math.ceil(total / pageSize)}
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span>{index}</span>
              <img
                style={{ width: "50px", height: "50px" }}
                src={item.avtar}
                alt={item.name}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        <div>{hasError ? "error" : null}</div>
      </div>
    </>
  );
}

export default App;
