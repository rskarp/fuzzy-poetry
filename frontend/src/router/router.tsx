import { createBrowserRouter, Navigate } from "react-router";
import ErrorBoundary from "../components/app/error-boundary";
import App from "../App";
import PageNotFound from "../components/app/page-not-found";
import { Path } from "./path";
import HomePage from "../components/home-page/home-page";
import OverviewPage from "../components/overview-page/overview-page";
import ContactPage from "../components/contact-page/contact-page";
import ContextPage from "../components/context-page/context-page";
import ContributorsPage from "../components/contributors-page/contributors-page";

const router = createBrowserRouter([
  {
    path: Path.Root,
    element: <App />,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        path: Path.Unknown,
        element: <PageNotFound />,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Root,
        element: <Navigate replace to={Path.Home} />,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Home,
        element: <HomePage />,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Overview,
        element: <OverviewPage />,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Context,
        element: <ContextPage />,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Contributors,
        element: <ContributorsPage />,
        errorElement: <PageNotFound />,
      },
      {
        path: Path.Contact,
        element: <ContactPage />,
        errorElement: <PageNotFound />,
      },
    ],
  },
]);

export default router;