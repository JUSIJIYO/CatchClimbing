import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashBoardPage from "../pages/admin/DashBoardPage";
import BranchDetailPage from "../pages/branch/BranchDetailPage";
import AuthLayout from "../layouts/AuthLayout";
import BranchListPage from "../pages/branch/BranchListPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <BranchListPage />,
      },
      {
        path: "branch",
        element: <BranchDetailPage />,
      },
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/totaladmin",
    element: <DashBoardPage />,
  },
  {
    path: "branchadmin",
    element: <DashBoardPage />,
  },
]);
