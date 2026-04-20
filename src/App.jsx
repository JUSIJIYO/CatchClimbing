import { RouterProvider } from 'react-router-dom';
import '../src/styles/global.css';
import { router } from './routes/router';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
