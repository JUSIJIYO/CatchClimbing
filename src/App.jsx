import { RouterProvider } from 'react-router-dom';
import '../src/styles/global.css'
import { router } from '../src/routes/router.jsx'
import Header from './components/layout/Header.jsx';
function App() {
  return (
    <>
      <RouterProvider router={router}/>    
    </>
    
  );
}

export default App;
