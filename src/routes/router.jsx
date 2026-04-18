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
import PrfManagePage from '../pages/admin/branch/PrfManagePage';
import BranchManagePage from '../pages/admin/BranchManagePage';
import MemberManagePage from '../pages/admin/total/MemberManagePage';
import ClassManagePage from '../pages/admin/ClassManagePage';
import CommuManagePage from '../pages/admin/CommuManagePage';
import SystemManagePage from '../pages/admin/total/SystemManagePage';
import OperateSettingPage from '../pages/admin/total/OperateSettingPage';
import AdminLayout from '../layouts/AdminLayout';

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
        path: 'level',
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
    path: "/seed",
    element: <SeedPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashBoardPage />,
      },
      {
        path: "usermanage",
        element: <MemberManagePage />,
      },
      {
        path: "prfmanage",
        element: <PrfManagePage />,
      },
      {
        path: "branchmanage",
        element: <BranchManagePage />,
      },
      {
        path: "classmanage",
        element: <ClassManagePage />,
      },
      {
        path: "community",
        element: <CommuManagePage />,
      },
      {
        path: "system",
        element: <SystemManagePage />,
      },
      {
        path: "operation",
        element: <OperateSettingPage />,
      },
    ],
  },
]);
