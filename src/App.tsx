import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './components/contexts/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
