import { createBrowserRouter, Navigate } from "react-router";
import ErrorBoundary from "../components/error-boundary";
import App from "../App";
import PageNotFound from "../components/page-not-found";
import { Path } from "./path";

const router = createBrowserRouter([
  {
    path: Path.Root,
    element: <App />,
    ErrorBoundary: ErrorBoundary,
    errorElement: <PageNotFound />,
    children: [
      {
        path: Path.Root,
        element: <Navigate replace to={Path.Home} />,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Home,
        element: <div>Home Page</div>,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Overview,
        element: <div>Overview</div>,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Context,
        element: <div>Context Page</div>,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Contributors,
        element: <div>Contributors Page</div>,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Contact,
        element: <div>Contact Page</div>,
        errorElement: <PageNotFound />,
      },
    ],
  },
  {
    path: Path.Unknown,
    element: <PageNotFound />,
    errorElement: <PageNotFound />,
  },
]);

export default router;