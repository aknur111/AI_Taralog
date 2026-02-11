import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { tarotApi, readingsApi } from '../services/api';
import type { TarotCard, Card } from '../services/api';
import MagicLoading from '../components/MagicLoading';
import { Loader2 } from 'lucide-react';

const CARD_IMAGES: Record<string, string> = {
  ar00: 'https://sacred-texts.com/tarot/pkt/img/ar00.jpg',
  ar01: 'https://sacred-texts.com/tarot/pkt/img/ar01.jpg',
  ar02: 'https://sacred-texts.com/tarot/pkt/img/ar02.jpg',
  ar03: 'https://sacred-texts.com/tarot/pkt/img/ar03.jpg',
  ar04: 'https://sacred-texts.com/tarot/pkt/img/ar04.jpg',
  ar05: 'https://sacred-texts.com/tarot/pkt/img/ar05.jpg',
  ar06: 'https://sacred-texts.com/tarot/pkt/img/ar06.jpg',
  ar07: 'https://sacred-texts.com/tarot/pkt/img/ar07.jpg',
  ar08: 'https://sacred-texts.com/tarot/pkt/img/ar08.jpg',
  ar09: 'https://sacred-texts.com/tarot/pkt/img/ar09.jpg',
  ar10: 'https://sacred-texts.com/tarot/pkt/img/ar10.jpg',
  ar11: 'https://sacred-texts.com/tarot/pkt/img/ar11.jpg',
  ar12: 'https://sacred-texts.com/tarot/pkt/img/ar12.jpg',
  ar13: 'https://sacred-texts.com/tarot/pkt/img/ar13.jpg',
  ar14: 'https://sacred-texts.com/tarot/pkt/img/ar14.jpg',
  ar15: 'https://sacred-texts.com/tarot/pkt/img/ar15.jpg',
  ar16: 'https://sacred-texts.com/tarot/pkt/img/ar16.jpg',
  ar17: 'https://sacred-texts.com/tarot/pkt/img/ar17.jpg',
  ar18: 'https://sacred-texts.com/tarot/pkt/img/ar18.jpg',
  ar19: 'https://sacred-texts.com/tarot/pkt/img/ar19.jpg',
  ar20: 'https://sacred-texts.com/tarot/pkt/img/ar20.jpg',
  ar21: 'https://sacred-texts.com/tarot/pkt/img/ar21.jpg',
  cuac: 'https://sacred-texts.com/tarot/pkt/img/cuac.jpg',
  cu02: 'https://sacred-texts.com/tarot/pkt/img/cu02.jpg',
  cu03: 'https://sacred-texts.com/tarot/pkt/img/cu03.jpg',
  cu04: 'https://sacred-texts.com/tarot/pkt/img/cu04.jpg',
  cu05: 'https://sacred-texts.com/tarot/pkt/img/cu05.jpg',
  cu06: 'https://sacred-texts.com/tarot/pkt/img/cu06.jpg',
  cu07: 'https://sacred-texts.com/tarot/pkt/img/cu07.jpg',
  cu08: 'https://sacred-texts.com/tarot/pkt/img/cu08.jpg',
  cu09: 'https://sacred-texts.com/tarot/pkt/img/cu09.jpg',
  cu10: 'https://sacred-texts.com/tarot/pkt/img/cu10.jpg',
  cupa: 'https://sacred-texts.com/tarot/pkt/img/cupa.jpg',
  cukn: 'https://sacred-texts.com/tarot/pkt/img/cukn.jpg',
  cuqu: 'https://sacred-texts.com/tarot/pkt/img/cuqu.jpg',
  cuki: 'https://sacred-texts.com/tarot/pkt/img/cuki.jpg',
  swac: 'https://sacred-texts.com/tarot/pkt/img/swac.jpg',
  sw02: 'https://sacred-texts.com/tarot/pkt/img/sw02.jpg',
  sw03: 'https://sacred-texts.com/tarot/pkt/img/sw03.jpg',
  sw04: 'https://sacred-texts.com/tarot/pkt/img/sw04.jpg',
  sw05: 'https://sacred-texts.com/tarot/pkt/img/sw05.jpg',
  sw06: 'https://sacred-texts.com/tarot/pkt/img/sw06.jpg',
  sw07: 'https://sacred-texts.com/tarot/pkt/img/sw07.jpg',
  sw08: 'https://sacred-texts.com/tarot/pkt/img/sw08.jpg',
  sw09: 'https://sacred-texts.com/tarot/pkt/img/sw09.jpg',
  sw10: 'https://sacred-texts.com/tarot/pkt/img/sw10.jpg',
  swpa: 'https://sacred-texts.com/tarot/pkt/img/swpa.jpg',
  swkn: 'https://sacred-texts.com/tarot/pkt/img/swkn.jpg',
  swqu: 'https://sacred-texts.com/tarot/pkt/img/swqu.jpg',
  swki: 'https://sacred-texts.com/tarot/pkt/img/swki.jpg',
  waac: 'https://sacred-texts.com/tarot/pkt/img/waac.jpg',
  wa02: 'https://sacred-texts.com/tarot/pkt/img/wa02.jpg',
  wa03: 'https://sacred-texts.com/tarot/pkt/img/wa03.jpg',
  wa04: 'https://sacred-texts.com/tarot/pkt/img/wa04.jpg',
  wa05: 'https://sacred-texts.com/tarot/pkt/img/wa05.jpg',
  wa06: 'https://sacred-texts.com/tarot/pkt/img/wa06.jpg',
  wa07: 'https://sacred-texts.com/tarot/pkt/img/wa07.jpg',
  wa08: 'https://sacred-texts.com/tarot/pkt/img/wa08.jpg',
  wa09: 'https://sacred-texts.com/tarot/pkt/img/wa09.jpg',
  wa10: 'https://sacred-texts.com/tarot/pkt/img/wa10.jpg',
  wapa: 'https://sacred-texts.com/tarot/pkt/img/wapa.jpg',
  wakn: 'https://sacred-texts.com/tarot/pkt/img/wakn.jpg',
  waqu: 'https://sacred-texts.com/tarot/pkt/img/waqu.jpg',
  waki: 'https://sacred-texts.com/tarot/pkt/img/waki.jpg',
  peac: 'https://sacred-texts.com/tarot/pkt/img/peac.jpg',
  pe02: 'https://sacred-texts.com/tarot/pkt/img/pe02.jpg',
  pe03: 'https://sacred-texts.com/tarot/pkt/img/pe03.jpg',
  pe04: 'https://sacred-texts.com/tarot/pkt/img/pe04.jpg',
  pe05: 'https://sacred-texts.com/tarot/pkt/img/pe05.jpg',
  pe06: 'https://sacred-texts.com/tarot/pkt/img/pe06.jpg',
  pe07: 'https://sacred-texts.com/tarot/pkt/img/pe07.jpg',
  pe08: 'https://sacred-texts.com/tarot/pkt/img/pe08.jpg',
  pe09: 'https://sacred-texts.com/tarot/pkt/img/pe09.jpg',
  pe10: 'https://sacred-texts.com/tarot/pkt/img/pe10.jpg',
  pepa: 'https://sacred-texts.com/tarot/pkt/img/pepa.jpg',
  pekn: 'https://sacred-texts.com/tarot/pkt/img/pekn.jpg',
  pequ: 'https://sacred-texts.com/tarot/pkt/img/pequ.jpg',
  peki: 'https://sacred-texts.com/tarot/pkt/img/peki.jpg'
};

interface CardState extends TarotCard {
  isReversed: boolean;
  isFlipped: boolean;
  position: string;
}

export default function TarotReading() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [cards, setCards] = useState<CardState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [allFlipped, setAllFlipped] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const loadingMessages = t('tarot.loading', { returnObjects: true }) as string[];

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

  const positions = [
    t('tarot.positions.you'),
    t('tarot.positions.past'),
    t('tarot.positions.present'),
    t('tarot.positions.future'),
    t('tarot.positions.advice')
  ];

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const tarotCards = await tarotApi.getRandomCards(5);
      setCards(tarotCards.map((card, index) => ({
        ...card,
        isReversed: Math.random() < 0.3,
        isFlipped: false,
        position: positions[index]
      })));
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const flipCard = (index: number) => {
    setCards(prev => {
      const updated = [...prev];
      if (!updated[index].isFlipped) {
        updated[index] = { ...updated[index], isFlipped: true };
      }
      
      const allNowFlipped = updated.every(c => c.isFlipped);
      if (allNowFlipped) setAllFlipped(true);
      
      return updated;
    });
  };

  const getInterpretation = async () => {
    setIsSubmitting(true);
    
    const cardsData: Card[] = cards.map(card => ({
      cardId: card.name_short,
      name: card.name,
      isReversed: card.isReversed,
      position: card.position
    }));

    try {
      const reading = await readingsApi.createTaro(cardsData, i18n.language);
      setInterpretation(reading.aiInterpretation);
    } catch (error) {
      console.error('Failed to get interpretation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  const renderMobileCard = (card: CardState, cardIndex: number, isTopRow: boolean) => (
    <motion.div
      key={cardIndex}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: cardIndex * 0.1 }}
      className="flex flex-col items-center"
    >
      <div className="bg-purple-600 text-white text-[9px] px-2 py-0.5 rounded-full mb-1 shrink-0">
        {card.position}
      </div>
      <div
        onClick={() => flipCard(cardIndex)}
        className={`card-flip w-full cursor-pointer shrink-0 ${!card.isFlipped ? 'animate-pulse-glow' : ''}`}
        style={{ 
          aspectRatio: '2/3',
          maxHeight: isTopRow ? 'calc((100dvh - 16rem) * 0.45)' : 'calc((100dvh - 16rem) * 0.38)'
        }}
      >
        <div className={`card-flip-inner w-full h-full ${card.isFlipped ? 'flipped' : ''}`}>
          <div className="card-face card-back rounded-lg overflow-hidden border-2 border-amber-500/50 bg-gradient-to-br from-purple-900 to-violet-950">
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xl">✦</span>
            </div>
          </div>
          <div 
            className="card-face card-front rounded-lg overflow-hidden border-2 border-amber-500/50 bg-white"
            style={{ transform: card.isReversed ? 'rotateY(180deg) rotate(180deg)' : 'rotateY(180deg)' }}
          >
            <img src={CARD_IMAGES[card.name_short] || ''} alt={card.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <div className="mt-1 text-center shrink-0">
        <p className="text-amber-400 text-[9px] font-medium leading-tight">{card.name}</p>
        {card.isReversed && <p className="text-purple-400 text-[7px]">({t('tarot.reversed')})</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="h-[calc(100dvh-5rem)] sm:min-h-[calc(100vh-5rem)] sm:h-auto flex flex-col px-3 overflow-x-hidden overflow-y-auto sm:overflow-visible">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2 sm:mb-8 pt-2 sm:pt-0 shrink-0"
      >
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-amber-400 mb-1 sm:mb-2">
          {t('tarot.title')}
        </h1>
        <p className="text-gray-400 text-xs sm:text-base">{t('tarot.subtitle')}</p>
      </motion.div>

      <div className="sm:hidden flex-1 flex flex-col justify-center px-2 min-h-0">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 px-6">
          {cards.slice(0, 2).map((card, index) => renderMobileCard(card, index, true))}
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 px-2">
          {cards.slice(2, 5).map((card, index) => renderMobileCard(card, index + 2, false))}
        </div>
      </div>

      <div className="hidden sm:flex flex-1 items-center justify-center py-4">
        <div className="flex flex-wrap justify-center items-end gap-x-5 md:gap-x-8 lg:gap-x-10 max-w-5xl">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`relative flex flex-col items-center ${index % 2 === 0 ? 'mb-14 md:mb-20 lg:mb-24' : 'mt-14 md:mt-20 lg:mt-24'}`}
            >
              <div className="bg-purple-600 text-white text-xs md:text-sm px-3 py-1 rounded-full mb-3">
                {card.position}
              </div>
              
              <div
                onClick={() => flipCard(index)}
                className={`card-flip w-[100px] h-[160px] md:w-[140px] md:h-[220px] lg:w-[160px] lg:h-[250px] cursor-pointer ${
                  !card.isFlipped ? 'animate-pulse-glow' : ''
                }`}
              >
                <div className={`card-flip-inner w-full h-full ${card.isFlipped ? 'flipped' : ''}`}>
                  <div className="card-face card-back rounded-xl overflow-hidden border-2 border-amber-500/50 bg-gradient-to-br from-purple-900 to-violet-950">
                    <div className="w-full h-full flex items-center justify-center bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10%200L20%2010L10%2020L0%2010z%22%20fill%3D%22%239333ea%22%20fill-opacity%3D%220.1%22%2F%3E%3C%2Fsvg%3E')]">
                      <span className="text-3xl md:text-5xl lg:text-6xl">✦</span>
                    </div>
                  </div>
                  
                  <div 
                    className="card-face card-front rounded-xl overflow-hidden border-2 border-amber-500/50 bg-white"
                    style={{ transform: card.isReversed ? 'rotateY(180deg) rotate(180deg)' : 'rotateY(180deg)' }}
                  >
                    <img
                      src={CARD_IMAGES[card.name_short] || ''}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-center w-[110px] md:w-[150px] lg:w-[170px]">
                <p className="text-amber-400 text-xs md:text-sm font-medium leading-tight">
                  {card.name}
                </p>
                {card.isReversed && (
                  <p className="text-purple-400 text-[10px] md:text-xs">({t('tarot.reversed')})</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {allFlipped && !interpretation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-3 sm:py-8 pb-4 sm:pb-8"
          >
            <button
              onClick={getInterpretation}
              disabled={isSubmitting}
              className="w-full max-w-sm mx-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-6 rounded-xl text-base sm:text-lg transition-all hover:scale-105 glow-gold disabled:opacity-50 overflow-hidden relative h-12 sm:h-14"
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
                    {t('tarot.getInterpretation')}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {interpretation && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 mt-6 max-w-4xl mx-auto"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4 sm:mb-6 text-center">
              {t('tarot.interpretation')}
            </h2>
            <div className="prose prose-invert prose-purple max-w-none prose-headings:text-amber-400 prose-strong:text-purple-300 prose-p:text-gray-300 prose-li:text-gray-300 prose-sm sm:prose-base md:px-4 lg:px-8">
              <ReactMarkdown>{interpretation}</ReactMarkdown>
            </div>
            
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => navigate('/history')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                {t('history.title')} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmitting && <MagicLoading />}
      </AnimatePresence>
    </div>
  );
}