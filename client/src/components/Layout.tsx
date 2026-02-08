import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen text-white">
      <div className="stars" />
      <Navbar />
      <main className="pt-20 pb-10 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}