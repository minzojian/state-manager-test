import { Link } from "react-router-dom";
import { mockPageDataRequest } from "../mock/pageDataService";
import { useCountStore } from "../store/count";
import { usePaginationDataStore } from "../store/paginationData";
import { useToDoListStore } from "../store/toDoList";

export default function App() {
  //这是两个count的store，分别是count1和count2
  const [count, { increase }] = useCountStore(1, "count1");
  const [count2, { increase: increase2 }] = useCountStore(10, "count2");
  //这是一个todoList的store，包含了增删改查的操作
  const [list, { add, removeAt, updateAt }, toDoStore] = useToDoListStore(
    [],
    "todoList"
  );
  //这里通过useAtom来获取doneCount的值。注意不能直接使用useAtom。而是使用store的useAtom.因为还要绑定store才能获取到相关的状态值。
  const [doneCount] = toDoStore.useAtom(toDoStore.atoms.doneCount);

  //这里是一个模拟分页请求的paginationDataStore。包含了分页数据的请求和状态管理
  const paginationDataStore = usePaginationDataStore({
    request: mockPageDataRequest,
    initState: { data: [] },
    storeKey: "pageData",
  });
  const [paginationState, { fetchMore }] = paginationDataStore;

  const { data, page, total, pageSize, hasMore, hasError, isLoading } =
    paginationState;

  return (
    <>
      <Link to="/page1">to page1</Link>
      <h1>state manage test - Jotai</h1>
      <div className="card">
        <button onClick={increase}>count is {count}</button>
        <button onClick={increase2}>count2 is {count2}</button>
        <br />
        <button onClick={() => add("" + Math.random())}>
          add random number task into todo list {list.length}
        </button>

        <div>Done Task:{doneCount}</div>
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
