import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashBoardPage from "../pages/admin/DashBoardPage";
import BranchDetailPage from "../pages/branch/BranchDetailPage";
import AuthLayout from "../layouts/AuthLayout";
import BranchListPage from "../pages/branch/BranchListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index : true,
        element : <BranchListPage/>
      },
      {
        path: "branch",
        element: <BranchDetailPage />,
      },
      {
        path: "login",
        element: <AuthLayout />,
      },
    ],
  },
  {
    path: "/totaladmin",
    element: <DashBoardPage />,
  },
  {
    path: "branchadmin",
    element: <DashBoardPage />
  }
]);
