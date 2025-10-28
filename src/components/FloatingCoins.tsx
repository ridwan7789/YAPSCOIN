import { motion } from "framer-motion";

export const FloatingCoins = () => {
  const coins = Array.from({ length: 8 }); // Reduced from 15 to 8 to improve performance

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {coins.map((_, i) => (
        <motion.img
          key={i}
          src="/assets/webp/yaps-logo.webp"
          alt=""
          className="absolute w-8 h-8 opacity-10" // Smaller and more transparent to reduce visual impact
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ 
            y: 0, 
            rotate: 0, 
            scale: 1,
            opacity: 0.1
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4, // Slightly longer to reduce animation frequency
            repeat: Infinity,
            delay: Math.random() * 3, // More varied delays
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
