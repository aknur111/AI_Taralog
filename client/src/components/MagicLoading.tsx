import { motion } from 'framer-motion';

export default function MagicLoading() {
  const smokeParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    side: i % 2 === 0 ? 'left' : 'right',
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    startY: 20 + Math.random() * 60,
    size: 30 + Math.random() * 40
  }));

  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    size: 0.5 + Math.random() * 1.5
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ 
          boxShadow: [
            'inset 0 0 100px 50px rgba(147, 51, 234, 0.3)',
            'inset 0 0 150px 80px rgba(147, 51, 234, 0.5)',
            'inset 0 0 100px 50px rgba(147, 51, 234, 0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {smokeParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            [particle.side]: -20,
            top: `${particle.startY}%`,
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)',
          }}
          animate={{
            x: particle.side === 'left' ? [0, 150, 200] : [0, -150, -200],
            y: [-20, -60, -100],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}

      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-amber-400"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: `${star.size}rem`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        >
          ✦
        </motion.div>
      ))}

      <motion.div
        className="absolute left-0 top-0 bottom-0 w-32"
        style={{
          background: 'linear-gradient(to right, rgba(147, 51, 234, 0.4), transparent)',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-32"
        style={{
          background: 'linear-gradient(to left, rgba(147, 51, 234, 0.4), transparent)',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        className="absolute left-0 right-0 top-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, rgba(147, 51, 234, 0.3), transparent)',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute left-0 right-0 bottom-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(147, 51, 234, 0.3), transparent)',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1.25 }}
      />
    </motion.div>
  );
}
