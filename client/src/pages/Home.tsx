import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Coins, Briefcase, Star } from 'lucide-react';

const services = [
  { key: 'tarot', icon: Sparkles, type: 'taro', color: 'from-purple-500 to-violet-600' },
  { key: 'love', icon: Heart, type: 'love', color: 'from-pink-500 to-rose-600' },
  { key: 'money', icon: Coins, type: 'money', color: 'from-amber-500 to-yellow-600' },
  { key: 'work', icon: Briefcase, type: 'work', color: 'from-blue-500 to-cyan-600' },
  { key: 'general', icon: Star, type: 'general', color: 'from-emerald-500 to-teal-600' }
];

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleServiceClick = (type: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/reading/${type}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="text-center py-16 md:py-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-gradient mb-6"
        >
          {t('home.title')}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
        >
          {t('home.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mb-12"
        >
          <div className="absolute inset-0 z-0">
            <motion.div 
              className="absolute inset-0 rounded-full border border-purple-300/10"
              style={{ scale: 1.8 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-300/80 to-purple-400/80 shadow-md shadow-indigo-400/30" />
            </motion.div>

            <motion.div 
              className="absolute inset-0 rounded-full border border-amber-300/10"
              style={{ scale: 1.5 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-9 h-3 border border-amber-300/50 rounded-full" style={{ transform: 'rotateX(65deg)' }} />
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200/80 to-orange-300/80 shadow-md shadow-amber-300/30 relative z-10" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute inset-0 rounded-full border border-rose-300/10"
              style={{ scale: 1.25 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-rose-200/80 to-pink-300/80 shadow-md shadow-rose-300/30" />
            </motion.div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative w-48 h-48 md:w-64 md:h-64 animate-float">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 blur-2xl animate-pulse" />
              <img 
                src="/crystal-ball.png" 
                alt="Crystal Ball" 
                className="relative w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {user ? (
            <button
              onClick={() => navigate('/reading/taro')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 glow-gold"
            >
              {t('home.startReading')}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 glow-gold"
            >
              {t('home.startJourney')}
            </button>
          )}
        </motion.div>
      </section>

      <section className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleServiceClick(service.type)}
              className="glass rounded-2xl p-6 cursor-pointer group hover:border-purple-400/40 transition-all hover:-translate-y-2"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-amber-400 mb-2">
                {t(`services.${service.key}.title`)}
              </h3>
              
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                {t(`services.${service.key}.desc`)}
              </p>
              
              <span className="inline-block text-purple-400 group-hover:text-purple-300 transition-colors">
                {t(`services.${service.key}.btn`)} →
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}