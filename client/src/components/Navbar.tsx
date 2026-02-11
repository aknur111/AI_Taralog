import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Taralog" className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-gradient">Taralog</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-amber-400 transition-colors">
              {t('nav.home')}
            </Link>
            
            {user && (
              <>
                <Link to="/history" className="text-gray-300 hover:text-amber-400 transition-colors">
                  {t('nav.history')}
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-amber-400 transition-colors">
                  {t('nav.profile')}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-300 hover:text-amber-400 transition-colors">
                    {t('nav.prompts')}
                  </Link>
                )}
              </>
            )}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-gray-300 hover:text-amber-400 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase text-sm">{i18n.language}</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 px-4 py-2 rounded-lg transition-all"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-purple-500/20">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-300 hover:text-amber-400 py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.home')}
            </Link>
            
            {user && (
              <>
                <Link
                  to="/history"
                  className="block text-gray-300 hover:text-amber-400 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.history')}
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-300 hover:text-amber-400 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.profile')}
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block text-gray-300 hover:text-amber-400 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.prompts')}
                  </Link>
                )}
              </>
            )}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-gray-300 hover:text-amber-400 py-2"
            >
              <Globe className="w-4 h-4" />
              <span>{i18n.language === 'ru' ? 'English' : 'Русский'}</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="block text-gray-300 hover:text-amber-400 py-2"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className="block bg-gradient-to-r from-purple-600 to-purple-700 text-center px-4 py-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}