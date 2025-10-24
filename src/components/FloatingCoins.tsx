import { motion } from "framer-motion";
import coinIcon from "@/assets/coin-icon.png";

export const FloatingCoins = () => {
  const coins = Array.from({ length: 15 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {coins.map((_, i) => (
        <motion.img
          key={i}
          src={coinIcon}
          alt=""
          className="absolute w-12 h-12 opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
