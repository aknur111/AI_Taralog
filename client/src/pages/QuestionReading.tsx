import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { readingsApi } from '../services/api';
import MagicLoading from '../components/MagicLoading';
import { Heart, Coins, Briefcase, Star, ChevronDown } from 'lucide-react';

const typeConfig = {
  love: { icon: Heart, color: 'from-pink-500 to-rose-600' },
  money: { icon: Coins, color: 'from-amber-500 to-yellow-600' },
  work: { icon: Briefcase, color: 'from-blue-500 to-cyan-600' },
  general: { icon: Star, color: 'from-emerald-500 to-teal-600' }
};

export default function QuestionReading() {
  const { type } = useParams<{ type: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState('');
  const [showPartner, setShowPartner] = useState(false);
  const [partnerData, setPartnerData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    birthTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [error, setError] = useState('');
  const [loadingIndex, setLoadingIndex] = useState(0);

  const loadingMessages = t('question.loading', { returnObjects: true }) as string[];

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isSubmitting, loadingMessages.length]);

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.general;
  const Icon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.length < 5) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      let reading;
      const lang = i18n.language;
      
      switch (type) {
        case 'love':
          const partner = Object.values(partnerData).some(v => v) ? partnerData : undefined;
          reading = await readingsApi.createLove(question, lang, partner);
          break;
        case 'money':
          reading = await readingsApi.createMoney(question, lang);
          break;
        case 'work':
          reading = await readingsApi.createWork(question, lang);
          break;
        default:
          reading = await readingsApi.createGeneral(question, lang);
      }
      
      setInterpretation(reading.aiInterpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 md:p-8"
      >
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-400">
            {t(`question.${type}`)}
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!interpretation ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t(`question.${type}`)}
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors min-h-[150px] resize-none"
                  placeholder={t('question.placeholder')}
                  required
                  minLength={5}
                />
              </div>

              {type === 'love' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPartner(!showPartner)}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${showPartner ? 'rotate-180' : ''}`} />
                    {t('question.partner.title')}
                  </button>
                  
                  <AnimatePresence>
                    {showPartner && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-purple-500/20">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              {t('question.partner.firstName')}
                            </label>
                            <input
                              type="text"
                              value={partnerData.firstName}
                              onChange={(e) => setPartnerData(p => ({ ...p, firstName: e.target.value }))}
                              className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              {t('question.partner.lastName')}
                            </label>
                            <input
                              type="text"
                              value={partnerData.lastName}
                              onChange={(e) => setPartnerData(p => ({ ...p, lastName: e.target.value }))}
                              className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              {t('question.partner.birthDate')}
                            </label>
                            <input
                              type="date"
                              value={partnerData.birthDate}
                              onChange={(e) => setPartnerData(p => ({ ...p, birthDate: e.target.value }))}
                              className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              {t('question.partner.birthTime')}
                            </label>
                            <input
                              type="time"
                              value={partnerData.birthTime}
                              onChange={(e) => setPartnerData(p => ({ ...p, birthTime: e.target.value }))}
                              className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">
                              {t('question.partner.birthPlace')}
                            </label>
                            <input
                              type="text"
                              value={partnerData.birthPlace}
                              onChange={(e) => setPartnerData(p => ({ ...p, birthPlace: e.target.value }))}
                              className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || question.length < 5}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden relative h-14"
              >
                <AnimatePresence mode="popLayout">
                  {isSubmitting ? (
                    <motion.span
                      key={loadingIndex}
                      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {loadingMessages[loadingIndex]}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="submit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {t('question.submit')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-bold text-amber-400 mb-4">
                {t('question.answer')}
              </h2>
              <div className="bg-white/5 rounded-xl p-4 md:p-6 prose prose-invert prose-purple max-w-none prose-headings:text-amber-400 prose-strong:text-purple-300 prose-p:text-gray-300 prose-li:text-gray-300">
                <ReactMarkdown>{interpretation}</ReactMarkdown>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => {
                    setInterpretation('');
                    setQuestion('');
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {t('question.newQuestion')}
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="flex-1 border border-purple-500/50 hover:border-purple-400 text-purple-400 font-semibold py-3 rounded-xl transition-colors"
                >
                  {t('history.title')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isSubmitting && <MagicLoading />}
      </AnimatePresence>
    </div>
  );
}