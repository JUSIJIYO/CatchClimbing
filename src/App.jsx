import { RouterProvider } from "react-router-dom"
// import{router}from "./routes/router.jsx"
import Header from './components/layout/Header';
import Modal from './components/common/Modal';
import ChkModal from './components/common/ChkModal';
import ConfirmModal from './components/common/ConfirmModal';
import Nav from "./components/layout/Nav"
import AuthLayout from "./layouts/AuthLayout.jsx";
import '../src/styles/global.css'
import FileUpload from "./components/common/FileUpload";

function App() {
  return (
    <>
      {/* <RouterProvider router={router}/> */}
      {/* 
      <Modal />
      <ChkModal />
      <ConfirmModal />
       */}
      <Header />
      <AuthLayout />
      <Nav />
      <FileUpload />
    </>
  );
}

export default App;
