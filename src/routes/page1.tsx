import { atom, createStore, useAtom } from "jotai";
import { useState } from "react";
import { Link } from "react-router-dom";

const counterAtom = atom(0);

const storeA = createStore();
const storeB = createStore();

const Page1: React.FC = () => {
  //这里是一个简单的计数器测试
  //这里使用了两个不同的store，所以两个count是独立的。
  const [count, setCount] = useAtom(counterAtom, { store: storeA });
  const [count2, setCount2] = useAtom(counterAtom, { store: storeB });
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };
  const increment2 = () => {
    setCount2((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <Link to="/">to root</Link>
      <h1>Page 1</h1>
      <div>
        <p>Count: {count}</p>
        <button onClick={increment}>Increment</button>
      </div>
      <div>
        <p>Count2: {count2}</p>
        <button onClick={increment2}>Increment2</button>
      </div>
    </div>
  );
};

export default Page1;
