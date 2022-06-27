import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import AppRouter from './components/AppRouter';
import { Context } from './firebase';
import { useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loader from './components/Loader';

function App() {
  const { auth } = useContext(Context);
  const [loading] = useAuthState(auth);

  // проверяет на загрузку страницы
  if (loading === false) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
