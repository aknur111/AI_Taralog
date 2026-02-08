import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import { motion } from 'framer-motion';
import { User, Check, Loader2 } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    birthTime: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setFormData({
        firstName: (data.firstName as string) || '',
        lastName: (data.lastName as string) || '',
        birthDate: data.birthDate ? new Date(data.birthDate as string).toISOString().split('T')[0] : '',
        birthPlace: (data.birthPlace as string) || '',
        birthTime: (data.birthTime as string) || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const dataToSend: Record<string, string> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value) dataToSend[key] = value;
      });

      await userApi.updateProfile(dataToSend);
      updateUser(dataToSend);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 md:p-8"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-amber-400">{user?.username}</h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        <div className="border-t border-purple-500/20 pt-6">
          <h2 className="text-lg font-semibold text-purple-400 mb-2">
            {t('profile.personalData')}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {t('profile.personalSub')}
          </p>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg mb-6"
            >
              <Check className="w-5 h-5" />
              <span>{t('profile.saved')}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {t('profile.firstName')}
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {t('profile.lastName')}
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {t('profile.birthDate')}
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(f => ({ ...f, birthDate: e.target.value }))}
                className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {t('profile.birthPlace')}
              </label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData(f => ({ ...f, birthPlace: e.target.value }))}
                className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {t('profile.birthTime')}
              </label>
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData(f => ({ ...f, birthTime: e.target.value }))}
                className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                t('profile.save')
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}