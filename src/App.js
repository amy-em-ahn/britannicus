import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import { AuthContextProvider } from './components/context/AuthContext';

export default function App() {
  console.log('App is rendering');
  return (
    <AuthContextProvider>
      <div className='app'>
        <div className='hero-with-nav'>
          <Navbar />
          <Hero />
        </div>
        <main className='main-content'>
          <Outlet />
        </main>
      </div>
    </AuthContextProvider>
  );
}
