import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashBoardPage from "../pages/admin/DashBoardPage";
import BranchDetailPage from "../pages/branch/BranchDetailPage";
import AuthLayout from "../layouts/AuthLayout";
import BranchListPage from "../pages/branch/BranchListPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import StuSignUpPage from "../pages/auth/StuSignUpPage";
import PrfSignUpPage from "../pages/auth/PrfSignUpPage";
import SignUpForm from "../components/auth/SignUpForm";
import CommuPostPage from "../pages/community/CommuPostPage";
import ClassListPage from "../pages/class/ClassListPage";
import ClassDetailPage from "../pages/class/ClassDetailPage";
import Mypage from "../pages/mypage/Mypage";
import SignUpCompletePage from "../pages/auth/SignUpCompletePage";

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
        path: "branch/:id",
        element: <BranchDetailPage />,
      },
      {
        path: "community",
        element: <CommuPostPage />,
      },
      {
        path: "class",
        element: <ClassListPage />,
      },
      {
        path: "class/:id",
        element: <ClassDetailPage />,
      },
      {
        path: "mypage",
        element: <Mypage />,
      },

      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
            children: [
              {
                index: true,
                element: <SignUpForm />,
              },
              {
                path: "stu",
                element: <StuSignUpPage />,
              },
              {
                path: "prf",
                element: <PrfSignUpPage />,
              },
            ],
          },
          {
            path: "signupcomplete",
            element: <SignUpCompletePage />,
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
