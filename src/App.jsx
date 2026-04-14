import { RouterProvider } from "react-router-dom"
// import{router}from "./routes/router.jsx"
import Header from './components/layout/Header';
import Modal from './components/common/Modal';
import ChkModal from './components/common/ChkModal';
import ConfirmModal from './components/common/ConfirmModal';
import Nav from "./components/layout/Nav"
import FileUpload from "./components/common/FileUpload";

function App() {
  return (
    <>
      <RouterProvider router={router}/>
      <Header />
      <Modal />
      <ChkModal />
      <ConfirmModal />
      <Nav />
      <FileUpload />
    </>
  );
}

export default App;
