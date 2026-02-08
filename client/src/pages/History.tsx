import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { readingsApi } from '../services/api';
import type { Reading } from '../services/api';
import { Sparkles, Heart, Coins, Briefcase, Star, Moon, X, Loader2 } from 'lucide-react';

const typeIcons = {
  taro: Sparkles,
  love: Heart,
  money: Coins,
  work: Briefcase,
  general: Star
};

export default function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    try {
      const data = await readingsApi.getAll();
      setReadings(data);
    } catch (error) {
      console.error('Failed to load readings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-400">
          {t('history.title')}
        </h1>
        <button
          onClick={() => navigate('/reading/taro')}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all text-sm"
        >
          {t('history.newReading')}
        </button>
      </div>

      {readings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Moon className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-amber-400 mb-2">
            {t('history.empty')}
          </h3>
          <p className="text-gray-400 mb-6">{t('history.emptySub')}</p>
          <button
            onClick={() => navigate('/reading/taro')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-6 py-3 rounded-xl transition-all"
          >
            {t('services.tarot.btn')}
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {readings.map((reading, index) => {
            const Icon = typeIcons[reading.readingType as keyof typeof typeIcons] || Star;
            
            return (
              <motion.div
                key={reading._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedReading(reading)}
                className="glass rounded-xl p-4 md:p-5 cursor-pointer hover:border-purple-400/40 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center shrink-0 group-hover:bg-purple-600/50 transition-colors">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-400 font-semibold">
                        {t(`history.types.${reading.readingType}`)}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {reading.question || (reading.cards?.length > 0 
                        ? reading.cards.map(c => c.name).join(', ')
                        : '')}
                    </p>
                    
                    <span className="text-gray-500 text-xs">
                      {formatDate(reading.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedReading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReading(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-amber-400">
                  {t(`history.types.${selectedReading.readingType}`)}
                </h2>
                <button
                  onClick={() => setSelectedReading(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedReading.question && (
                <div className="mb-4">
                  <h4 className="text-purple-400 text-sm font-medium mb-1">
                    {t('question.placeholder').replace('...', '')}
                  </h4>
                  <p className="text-gray-300">{selectedReading.question}</p>
                </div>
              )}

              {selectedReading.cards && selectedReading.cards.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-purple-400 text-sm font-medium mb-2">
                    {t('tarot.title')}
                  </h4>
                  <div className="space-y-2">
                    {selectedReading.cards.map((card, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-500/20">
                        <span className="text-purple-300">{card.position}</span>
                        <span className="text-gray-300">
                          {card.name}
                          {card.isReversed && (
                            <span className="text-gray-500 ml-1">({t('tarot.reversed')})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-purple-400 text-sm font-medium mb-2">
                  {t('tarot.interpretation')}
                </h4>
                <div className="prose prose-invert prose-purple max-w-none prose-headings:text-amber-400 prose-strong:text-purple-300 prose-p:text-gray-300 prose-li:text-gray-300 prose-sm">
                  <ReactMarkdown>{selectedReading.aiInterpretation}</ReactMarkdown>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <span className="text-gray-500 text-sm">
                  {formatDate(selectedReading.createdAt)}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}