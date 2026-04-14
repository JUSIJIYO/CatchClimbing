import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';
// import{router}from "./routes/router.jsx"
import Header from './components/layout/Header';
import Modal from './components/common/Modal';
import ChkModal from './components/common/ChkModal';
import ConfirmModal from './components/common/ConfirmModal';
import BranchListPage from './pages/branch/BranchListPage.jsx';
import Nav from "./components/layout/Nav"
import AuthLayout from "./layouts/AuthLayout.jsx";
import '../src/styles/global.css'
import FileUpload from "./components/common/FileUpload";
import ClassCard from "./components/class/ClassCard";
import ClassListPage from './pages/class/ClassListPage.jsx';

function App() {
  return (
    <>
      {/* <BranchListPage /> */}
      {/* <RouterProvider router={router}/> */}
      {/* 
      <Modal />
      <ChkModal />
      <ConfirmModal />
       */}
      {/* <Header />
      <AuthLayout />
      <Nav />
      <FileUpload /> */}
      {/* <ClassCard /> */}
      <ClassListPage />
    </>
  );
}

export default App;
