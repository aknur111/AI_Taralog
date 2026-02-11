import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Constellations from './Constellations';

export default function Layout() {
  return (
    <div className="min-h-screen text-white">
      <div className="stars" />
      <Constellations />
      <Navbar />
      <main className="pt-20 pb-10 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}