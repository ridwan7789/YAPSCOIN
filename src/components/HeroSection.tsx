import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles } from "lucide-react";
import { YAPS_CONFIG } from "@/lib/constants";

export const HeroSection = () => {
  // URLs for the buttons - these will be loaded from config
  const buyYapsUrl = YAPS_CONFIG.EXCHANGE_URL;
  const yapsChartUrl = YAPS_CONFIG.CHART_URL;

  // Sound effects with better error handling
  const playSound = async (soundFile: string) => {
    try {
      // Check if audio is allowed to play (user interaction requirement)
      if (typeof Audio !== 'undefined') {
        const audio = new Audio(`/mixkit-${soundFile}`);
        await audio.play();
      }
    } catch (e) {
      // Audio play failed (likely due to autoplay restrictions)
      // This is expected in many browsers, so we just silently handle it
      console.debug("Audio play prevented by browser:", e);
    }
  };

  const handleBuyClick = () => {
    playSound("happy-puppy-barks-741.wav"); // Positive sound for buying
    // Delay navigation slightly to allow sound to play
    setTimeout(() => {
      window.open(buyYapsUrl, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  const handleChartClick = () => {
    playSound("fast-rocket-whoosh-1714.wav"); // Exciting sound for chart
    // Delay navigation slightly to allow sound to play
    setTimeout(() => {
      window.open(yapsChartUrl, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/src/assets/webp/baner-space.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label="YAPS COIN hero section with buy and chart links"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: YAPS_CONFIG.ANIMATION.starCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            aria-hidden="true" // Animated decorative elements don't need to be announced by screen readers
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-display text-glow-gold leading-tight"
            animate={{ 
              textShadow: [
                `0 0 ${YAPS_CONFIG.ANIMATION.glowIntensity}px hsl(37 100% 64%), 0 0 ${YAPS_CONFIG.ANIMATION.glowIntensity * 2}px hsl(37 100% 64%)`,
                `0 0 ${YAPS_CONFIG.ANIMATION.glowIntensity * 1.5}px hsl(37 100% 64%), 0 0 ${YAPS_CONFIG.ANIMATION.glowIntensity * 3}px hsl(37 100% 64%)`,
                `0 0 ${YAPS_CONFIG.ANIMATION.glowIntensity}px hsl(37 100% 64%), 0 0 ${YAPS_CONFIG.ANIMATION.glowIntensity * 2}px hsl(37 100% 64%)`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            id="hero-title"
          >
            YAPS COIN 🤟
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-4xl font-bold text-secondary text-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            aria-describedby="hero-subtitle"
          >
            Where Memes Meet Money
          </motion.p>

          <motion.p 
            className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            id="hero-subtitle"
          >
            When the market crashes,<br />
            When everyone panics,<br />
            The Yaps community just says:<br />
            🤟 "YAPS, it's okay." 🤟<br />
            YAPS 🤟 YAPS 🤟 YAPS 🤟 YAPS 🤟 YAPS
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            role="group"
            aria-labelledby="action-buttons"
          >
            <Button variant="hero" size="xl" className="group" onClick={handleBuyClick} aria-label="Buy YAPS COIN on Pancakeswap">
              <Rocket className="mr-2 group-hover:animate-bounce" aria-hidden="true" />
              Buy $YAPS
            </Button>
            <Button variant="neon" size="xl" className="group" onClick={handleChartClick} aria-label="View YAPS COIN chart on DexTools">
              <Sparkles className="mr-2 group-hover:animate-spin" aria-hidden="true" />
              YAPS CHART
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
