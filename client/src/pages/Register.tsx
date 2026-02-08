import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    birthTime: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(
        formData.username, 
        formData.email, 
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          birthPlace: formData.birthPlace,
          birthTime: formData.birthTime || undefined
        }
      );
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          
          <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-400">{t('auth.createAccount')}</h2>
            <p className="text-gray-400 mt-2">{t('auth.createSub')}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.username')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder={t('auth.username')}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-purple-500/20">
              <p className="text-purple-400 text-sm font-medium mb-4">{t('auth.birthDataTitle')}</p>
              <p className="text-gray-500 text-xs mb-4">{t('auth.birthDataHint')}</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('profile.firstName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('profile.lastName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {t('profile.birthDate')} *
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {t('profile.birthPlace')} *
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => handleChange('birthPlace', e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    placeholder={t('auth.birthPlacePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {t('profile.birthTime')}
                    <span className="text-gray-500 text-xs ml-2">({t('auth.optional')})</span>
                  </label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => handleChange('birthTime', e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? '...' : t('auth.signUp')}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}