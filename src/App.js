import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';

export default function App() {
  console.log('App is rendering');
  return (
    <div className='app'>
      <div className='hero-with-nav'>
        <Navbar />
        <Hero />
      </div>
      <main className='main-content'>
        <Outlet />
      </main>
    </div>
  );
}
