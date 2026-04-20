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
import AdminPrfDetailPage from '../pages/admin/AdminPrfDetailPage';
import BranchManagePage from '../pages/admin/BranchManagePage';
import MemberManagePage from '../pages/admin/total/MemberManagePage';
import ClassManagePage from '../pages/admin/ClassManagePage';
import CommuManagePage from '../pages/admin/CommuManagePage';
import SystemManagePage from '../pages/admin/total/SystemManagePage';
import OperateSettingPage from '../pages/admin/total/OperateSettingPage';
import AdminLayout from '../layouts/AdminLayout';
import RecordDetailPage from '../pages/record/RecordDetailPage';
import RecordEditPage from '../pages/record/RecordEditPage';
import ProfilePage from '../pages/mypage/MyProfilePage';
import EditProfilePage from '../pages/mypage/EditProfilePage';
import PrfFormPage from '../pages/professor/PrfFormPage';
import CommuPage from '../pages/community/CommuPage';
import CommuReviewPage from '../pages/community/CommuReviewPage';
import PostDetailPage from '../pages/community/PostDetailpage';
import ReviewDetailPage from '../pages/community/ReviewDetailPage';
import PostFormPage from '../pages/community/PostFormPage';
import PrfClassStuList from '../pages/professor/PrfClassStuListPage';
import PrfClassManagePage from '../pages/professor/ClassManagePage';
import AdminPrfApprovePage from '../pages/admin/AdminPrfApprovePage';
import BranchForm from '../components/admin/BranchForm';
import BranchadminBranchManage from '../pages/admin/branch/BranchadminBranchManage';
import BranchApprovePage from '../pages/admin/BranchApprovePage';
import AdminBranchDetailPage from '../pages/admin/AdminBranchDetailPage';
import { useAuth } from '../context/AuthContext';
import CalendarPage from '../pages/calendar/CalendarPage';
import ScheduleDetailPage from '../pages/calendar/ScheduleDetailPage';

function BranchManageRoute() {
  const { role } = useAuth();
  return role === 'branchAdmin' ? (
    <BranchadminBranchManage />
  ) : (
    <BranchManagePage />
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <BranchListPage />,
      },
      {
        path: 'branch',
        element: <BranchListPage />,
      },
      {
        path: 'branch/:id',
        element: <BranchDetailPage />,
      },
      {
        path: 'commu',
        element: <CommuPage />,
      },
      {
        path: 'community',
        element: <CommuPostPage />,
      },

      {
        path: '/review',
        element: <CommuReviewPage />,
      },

      {
        path: '/post/:id',
        element: <PostDetailPage />,
      },
      {
        path: '/post/edit/:postId',
        element: <PostFormPage />,
      },

      {
        path: '/postform',
        element: <PostFormPage />,
      },
      {
        path: '/reviewdetail',
        element: <ReviewDetailPage />,
      },

      {
        path: 'class',
        element: <ClassListPage />,
      },
      {
        path: 'class/:id',
        element: <ClassDetailPage />,
      },
      {
        path: 'mypage',
        element: <Mypage />,
      },
      {
        path: 'edit-profile',
        element: <EditProfilePage />,
      },
      {
        path: 'level',
        element: <MyLevelSystemPage />,
      },
      {
        path: 'record',
        element: <RecordListPage />,
      },
      {
        path: 'record/new',
        element: <RecordFormPage />,
      },
      { path: 'record/:id', element: <RecordDetailPage /> },
      {
        path: 'record/edit/:id',
        element: <RecordEditPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'professor/new-class',
        element: <PrfFormPage />,
      },
      {
        path: 'professor/edit/:id',
        element: <PrfFormPage />,
      },
      {
        path: 'professor/manage',
        element: <PrfClassManagePage />,
      },
      {
        path: 'professor/class/:id/students',
        element: <PrfClassStuList />,
      },
      {
        path: '/calendar',
        element: <CalendarPage />,
      },
      {
        path: '/schedule/:date',
        element: <ScheduleDetailPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'signup',
            element: <SignUpPage />,
            children: [
              {
                index: true,
                element: <SignUpForm />,
              },
              {
                path: 'stu',
                element: <StuSignUpPage />,
              },
              {
                path: 'prf',
                element: <PrfSignUpPage />,
              },
            ],
          },
          {
            path: 'signupcomplete',
            element: <SignUpCompletePage />,
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashBoardPage />,
      },
      {
        path: 'usermanage',
        element: <MemberManagePage />,
      },
      {
        path: 'usermanage/prfapporve',
        element: <AdminPrfApprovePage />,
      },
      {
        path: 'prfmanage',
        element: <PrfManagePage />,
      },
      {
        path: 'prfmanage/prfapporve',
        element: <AdminPrfApprovePage />,
      },
      {
        path: 'branch-form',
        element: <BranchForm />,
      },
      {
        path: 'professor/:id',
        element: <AdminPrfDetailPage />,
      },
      {
        path: 'branchmanage',
        element: <BranchManageRoute />,
      },
      {
        path: 'branchmanage/approve',
        element: <BranchApprovePage />,
      },
      {
        path: 'branchmanage/:id',
        element: <AdminBranchDetailPage />,
      },
      {
        path: 'classmanage',
        element: <ClassManagePage />,
      },
      {
        path: 'community',
        element: <CommuManagePage />,
      },
      {
        path: 'system',
        element: <SystemManagePage />,
      },
      {
        path: 'operation',
        element: <OperateSettingPage />,
      },
    ],
  },
]);
