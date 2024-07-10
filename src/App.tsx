import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";

import React, { Suspense } from "react";
const Page1 = React.lazy(() => import("./routes/page1"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/page1",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Page1 />
      </Suspense>
    ),
  },
]);

const AppWithProvider = () => {
  return <RouterProvider router={router} />;
};

export default AppWithProvider;
