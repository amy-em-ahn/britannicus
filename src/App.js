import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import { AuthContextProvider } from './components/context/AuthContext';

export default function App() {
  console.log('App is rendering');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <AuthContextProvider>
      <div className='app'>
        <div className={isHomePage ? 'hero-with-nav' : 'sub-page-header'}>
          <Navbar />
          {isHomePage && <Hero />}
        </div>
        <main className='main-content'>
          <Outlet />
        </main>
      </div>
    </AuthContextProvider>
  );
}
