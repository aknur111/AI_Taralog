import { motion } from 'framer-motion';
import { useMemo } from 'react';

const generateStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    });
  }
  return stars;
};

export default function Constellations() {
  const stars = useMemo(() => generateStars(50), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            transparent 30%,
            rgba(147, 112, 219, 0.03) 35%,
            rgba(200, 180, 255, 0.06) 45%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(200, 180, 255, 0.06) 55%,
            rgba(147, 112, 219, 0.03) 65%,
            transparent 70%,
            transparent 100%
          )`,
          filter: 'blur(30px)',
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            transparent 35%,
            rgba(255, 255, 255, 0.02) 45%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.02) 55%,
            transparent 65%,
            transparent 100%
          )`,
          filter: 'blur(15px)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {stars.map((star, index) => (
        <motion.div
          key={star.id}
          className={`absolute rounded-full ${index > 25 ? 'hidden md:block' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(200,180,255,0.5) 50%, transparent 100%)`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.5), 0 0 ${star.size * 4}px rgba(147,112,219,0.3)`,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}

      <motion.img
        src="/sagittarius.png"
        alt=""
        className="absolute w-[300px] md:w-[450px] lg:w-[550px] h-auto opacity-10 md:opacity-20"
        style={{ 
          top: '0%', 
          left: '-15%',
        }}
        animate={{
          scale: [1, 1.02, 1],
          filter: [
            'brightness(0.8) saturate(1.1)',
            'brightness(1) saturate(1.3)',
            'brightness(0.8) saturate(1.1)',
          ]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.img
        src="/ursa.png"
        alt=""
        className="absolute w-[280px] md:w-[400px] lg:w-[500px] h-auto opacity-10 md:opacity-15"
        style={{ 
          bottom: '5%', 
          right: '-10%',
        }}
        animate={{
          scale: [1, 1.02, 1],
          filter: [
            'brightness(0.8) saturate(1.2)',
            'brightness(1) saturate(1.4)',
            'brightness(0.8) saturate(1.2)',
          ]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}
