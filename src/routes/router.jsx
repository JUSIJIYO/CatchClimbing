import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

const Loading = () => (
  <div >
    로딩 중...
  </div>
);

const sus = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage'));
const StuSignUpPage = lazy(() => import('../pages/auth/StuSignUpPage'));
const PrfSignUpPage = lazy(() => import('../pages/auth/PrfSignUpPage'));
const SignUpForm = lazy(() => import('../components/auth/SignUpForm'));
const SignUpCompletePage = lazy(() => import('../pages/auth/SignUpCompletePage'));
const BranchListPage = lazy(() => import('../pages/branch/BranchListPage'));
const BranchDetailPage = lazy(() => import('../pages/branch/BranchDetailPage'));
const CommuPage = lazy(() => import('../pages/community/CommuPage'));
const CommuPostPage = lazy(() => import('../pages/community/CommuPostPage'));
const CommuReviewPage = lazy(() => import('../pages/community/CommuReviewPage'));
const PostDetailPage = lazy(() => import('../pages/community/PostDetailpage'));
const PostFormPage = lazy(() => import('../pages/community/PostFormPage'));
const ReviewDetailPage = lazy(() => import('../pages/community/ReviewDetailPage'));
const ReviewFormPage = lazy(() => import('../pages/community/ReviewFormPage'));
const ClassListPage = lazy(() => import('../pages/class/ClassListPage'));
const ClassDetailPage = lazy(() => import('../pages/class/ClassDetailPage'));
const Mypage = lazy(() => import('../pages/mypage/Mypage'));
const MyClassListPage = lazy(() => import('../pages/mypage/MyClassListPage'));
const EditProfilePage = lazy(() => import('../pages/mypage/EditProfilePage'));
const MyLevelSystemPage = lazy(() => import('../pages/mypage/MyLevelSystemPage'));
const ProfilePage = lazy(() => import('../pages/mypage/MyProfilePage'));
const RecordListPage = lazy(() => import('../pages/record/RecordListPage'));
const RecordFormPage = lazy(() => import('../pages/record/RecordFormPage'));
const RecordDetailPage = lazy(() => import('../pages/record/RecordDetailPage'));
const RecordEditPage = lazy(() => import('../pages/record/RecordEditPage'));
const CalendarPage = lazy(() => import('../pages/calendar/CalendarPage'));
const ScheduleDetailPage = lazy(() => import('../pages/calendar/ScheduleDetailPage'));
const PrfFormPage = lazy(() => import('../pages/professor/PrfFormPage'));
const PrfClassStuList = lazy(() => import('../pages/professor/PrfClassStuListPage'));
const PrfClassManagePage = lazy(() => import('../pages/professor/ClassManagePage'));
const DashBoardPage = lazy(() => import('../pages/admin/DashBoardPage'));
const AdminPrfDetailPage = lazy(() => import('../pages/admin/AdminPrfDetailPage'));
const BranchManagePage = lazy(() => import('../pages/admin/BranchManagePage'));
const MemberManagePage = lazy(() => import('../pages/admin/total/MemberManagePage'));
const ClassManagePage = lazy(() => import('../pages/admin/ClassManagePage'));
const CommuManagePage = lazy(() => import('../pages/admin/CommuManagePage'));
const SystemManagePage = lazy(() => import('../pages/admin/total/SystemManagePage'));
const OperateSettingPage = lazy(() => import('../pages/admin/total/OperateSettingPage'));
const PrfManagePage = lazy(() => import('../pages/admin/branch/PrfManagePage'));
const AdminPrfApprovePage = lazy(() => import('../pages/admin/AdminPrfApprovePage'));
const BranchForm = lazy(() => import('../components/admin/BranchForm'));
const BranchadminBranchManage = lazy(() => import('../pages/admin/branch/BranchadminBranchManage'));
const BranchApprovePage = lazy(() => import('../pages/admin/BranchApprovePage'));
const AdminBranchDetailPage = lazy(() => import('../pages/admin/AdminBranchDetailPage'));

function BranchManageRoute() {
  const { role } = useAuth();
  return role === 'branchAdmin' ? (
    <Suspense fallback={<Loading />}><BranchadminBranchManage /></Suspense>
  ) : (
    <Suspense fallback={<Loading />}><BranchManagePage /></Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: sus(BranchListPage) },
      { path: 'branch', element: sus(BranchListPage) },
      { path: 'branch/:id', element: sus(BranchDetailPage) },
      { path: 'commu', element: sus(CommuPage) },
      { path: 'community', element: sus(CommuPostPage) },
      { path: '/review', element: sus(CommuReviewPage) },
      { path: '/post/:id', element: sus(PostDetailPage) },
      { path: '/post/edit/:postId', element: sus(PostFormPage) },
      { path: '/postform', element: sus(PostFormPage) },
      { path: '/reviewdetail', element: sus(ReviewDetailPage) },
      { path: '/reviewform', element: sus(ReviewFormPage) },
      { path: 'class', element: sus(ClassListPage) },
      { path: 'class/:id', element: sus(ClassDetailPage) },
      { path: 'mypage', element: sus(Mypage) },
      { path: '/mypage/classlist', element: sus(MyClassListPage) },
      { path: 'edit-profile', element: sus(EditProfilePage) },
      { path: 'level', element: sus(MyLevelSystemPage) },
      { path: 'record', element: sus(RecordListPage) },
      { path: 'record/new', element: sus(RecordFormPage) },
      { path: 'record/:id', element: sus(RecordDetailPage) },
      { path: 'record/edit/:id', element: sus(RecordEditPage) },
      { path: 'calendar', element: sus(CalendarPage) },
      { path: '/calendar', element: sus(CalendarPage) },
      { path: '/schedule/:date', element: sus(ScheduleDetailPage) },
      { path: 'profile', element: sus(ProfilePage) },
      { path: 'professor/new-class', element: sus(PrfFormPage) },
      { path: 'professor/edit/:id', element: sus(PrfFormPage) },
      { path: 'professor/manage', element: sus(PrfClassManagePage) },
      { path: 'professor/class/:id/students', element: sus(PrfClassStuList) },
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: sus(LoginPage) },
          {
            path: 'signup',
            element: sus(SignUpPage),
            children: [
              { index: true, element: sus(SignUpForm) },
              { path: 'stu', element: sus(StuSignUpPage) },
              { path: 'prf', element: sus(PrfSignUpPage) },
            ],
          },
          { path: 'signupcomplete', element: sus(SignUpCompletePage) },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: sus(DashBoardPage) },
      { path: 'usermanage', element: sus(MemberManagePage) },
      { path: 'usermanage/prfapporve', element: sus(AdminPrfApprovePage) },
      { path: 'usermanage/professor/:id', element: sus(AdminPrfDetailPage) },
      { path: 'prfmanage', element: sus(PrfManagePage) },
      { path: 'prfmanage/prfapporve', element: sus(AdminPrfApprovePage) },
      { path: 'branch-form', element: sus(BranchForm) },
      { path: 'professor/:id', element: sus(AdminPrfDetailPage) },
      { path: 'branchmanage', element: <BranchManageRoute /> },
      { path: 'branchmanage/approve', element: sus(BranchApprovePage) },
      { path: 'branchmanage/:id', element: sus(AdminBranchDetailPage) },
      { path: 'classmanage', element: sus(ClassManagePage) },
      { path: 'community', element: sus(CommuManagePage) },
      { path: 'system', element: sus(SystemManagePage) },
      { path: 'operation', element: sus(OperateSettingPage) },
    ],
  },
]);
