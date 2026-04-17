import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashBoardPage from '../pages/admin/DashBoardPage';
import BranchDetailPage from '../pages/branch/BranchDetailPage';
import AuthLayout from '../layouts/AuthLayout';
import BranchListPage from '../pages/branch/BranchListPage';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import StuSignUpPage from '../pages/auth/StuSignUpPage';
import PrfSignUpPage from '../pages/auth/PrfSignUpPage';
import SignUpForm from '../components/auth/SignUpForm';
import CommuPostPage from '../pages/community/CommuPostPage';
import ClassListPage from '../pages/class/ClassListPage';
import ClassDetailPage from '../pages/class/ClassDetailPage';
import Mypage from '../pages/mypage/Mypage';
import SignUpCompletePage from '../pages/auth/SignUpCompletePage';
import MyLevelSystemPage from '../pages/mypage/MyLevelSystemPage';
import RecordListPage from '../pages/record/RecordListPage';
import RecordFormPage from '../pages/record/RecordFormPage';
import RecordDetailPage from '../pages/record/RecordDetailPage';
import RecordEditPage from '../pages/record/RecordEditPage';
import CommuPage from "../pages/community/CommuPage";
import CommuReviewPage from "../pages/community/CommuReviewPage";
import PostDetailPage from "../pages/community/PostDetailpage";
import ReviewDetailPage from "../pages/community/ReviewDetailPage";

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
        path: "commu",
        element: <CommuPage />,
      },
      {
        path: "community",
        element: <CommuPostPage />,
      },

      {
        path: "/review",
        element: <CommuReviewPage />,
      },

      {
        path: "/postdetail",
        element: <PostDetailPage />,
      },
      {
        path: "/reviewdetail",
        element: <ReviewDetailPage />,
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
        path: "level",
        element: <MyLevelSystemPage />,
      },
      {
        path: "record",
        element: <RecordListPage />,
      },
      {
        path: "record/new",
        element: <RecordFormPage />,
      },
      { path: 'record/:id', element: <RecordDetailPage /> },
      {
        path: '/record/edit/:id',
        element: <RecordEditPage />,
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
