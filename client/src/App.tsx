import { ErrorBoundary } from "@/error-boundary";
import HomePage from "@/pages/home";
import DockerPage from "@/pages/docker";
import Layout from "@/pages/layout";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";

// Route wrappers
const ProtectedRoute = () => {
  const isAuth = true;
  if (!isAuth) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const PublicRoute = ({ restricted = false }) => {
  const isAuth = true;
  if (isAuth && restricted) return <Navigate to="/" replace />;
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/docker",
            element: <DockerPage />,
          },
          {
            path: "/docker/*",
            element: <DockerPage />,
          },
        ],
      },
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
