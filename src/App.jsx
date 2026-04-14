import { RouterProvider } from 'react-router-dom';
import '../src/styles/global.css';
import { router } from './routes/router';
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
