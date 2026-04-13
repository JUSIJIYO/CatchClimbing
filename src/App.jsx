import { RouterProvider } from "react-router-dom"
import{router}from "./routes/router.jsx"

function App() {
import Header from './components/layout/Header';
import Modal from './components/common/Modal';
import ChkModal from './components/common/ChkModal';

function App() {
  return (
    <>
      <RouterProvider router={router}/>
      <Header />
      <Modal />
      <ChkModal />
    </>
  );
}

export default App;
