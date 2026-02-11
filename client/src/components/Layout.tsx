import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Constellations from './Constellations';

export default function Layout() {
  return (
    <div className="min-h-screen min-h-[100dvh] text-white overflow-x-hidden w-full max-w-full">
      <div className="stars" />
      <Constellations />
      <Navbar />
      <main className="pt-20 pb-10 relative z-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}