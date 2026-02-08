import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './i18n';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TarotReading from './pages/TarotReading';
import QuestionReading from './pages/QuestionReading';
import History from './pages/History';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route path="reading/taro" element={
          <PrivateRoute>
            <TarotReading />
          </PrivateRoute>
        } />
        
        <Route path="reading/:type" element={
          <PrivateRoute>
            <QuestionReading />
          </PrivateRoute>
        } />
        
        <Route path="history" element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        } />
        
        <Route path="profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        <Route path="admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}