import AppRoutes from './routes/AppRoutes';
import { ErrorTester } from './utilits/test/ErrorTester.tsx';

function App() {
  return (
    <div>
      <ErrorTester />
      <AppRoutes />
    </div>
  );
}

export default App;
