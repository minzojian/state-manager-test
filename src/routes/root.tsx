import { useEffect } from "react";
import { Link } from "react-router-dom";
import { mockPageDataRequest } from "../mock/pageDataService";
import { useCountStore } from "../store/count";
import { usePaginationDataStore } from "../store/paginationData";
import { useToDoListStore } from "../store/toDoList";

export default function App() {
  const [{ count, increase }, countStore] = useCountStore("count1");
  const [{ count: count2, increase: increase2 }] = useCountStore("count2");
  const [{ list, add, removeAt, updateAt }, toDoListStore] = useToDoListStore();

  useEffect(() => {
    const unsubscribe = toDoListStore.subscribe(
      (state) => state.list,
      (next, prev) => {
        countStore.setState((state) => {
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

  const [
    { data, page, total, pageSize, hasMore, hasError, isLoading, fetchMore },
  ] = usePaginationDataStore({
    request: mockPageDataRequest,
  });

  return (
    <>
      <Link to="/page1">to page1</Link>
      <h1>state manage test - zustand</h1>
      <div className="card">
        <button onClick={increase}>count is {count}</button>
        <button onClick={increase2}>count2 is {count2}</button>
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
