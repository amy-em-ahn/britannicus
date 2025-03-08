import './App.css';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

export default function App() {
  console.log('App is rendering');
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
