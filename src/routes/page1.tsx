import { create, createStore, useStore } from "zustand";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCountStore } from "../store/count";

type CountState = {
  count: number;
  increase: () => void;
  reset: () => void;
  updateCount: (value: number) => void;
};

const createCountStore = () =>
  createStore<CountState>((set) => ({
    count: 0,
    increase: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 }),
    updateCount: (value) => set({ count: value }),
  }));

const store1 = createCountStore();
const store2 = createCountStore();

const Page1: React.FC = () => {
  //这里是一个简单的计数器测试
  //这里使用了两个不同的store，所以两个count是独立的。

  const { count, increase } = useStore(store1);
  const { count: count2, increase: increase2 } = useStore(store2);
  const [{ count: count3, increase: increase3 }] = useCountStore();
  return (
    <div>
      <Link to="/">to root</Link>
      <h1>Page 1</h1>
      <div>
        <p>Count: {count}</p>
        <button onClick={increase}>increase via store1</button>
      </div>
      <div>
        <p>Count2: {count2}</p>
        <button onClick={increase2}>increase via store2</button>
      </div>
      <div>
        <p>Count3: {count3}</p>
        <button onClick={increase3}>increase via useCountStore</button>
      </div>
    </div>
  );
};

export default Page1;
