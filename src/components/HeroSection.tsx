import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles } from "lucide-react";
import heroSpace from "@/assets/hero-space.jpg";

export const HeroSection = () => {
  // URLs for the buttons - these will need to be updated with actual token addresses when available
  const buyYapsUrl = "https://pancakeswap.finance/swap?outputCurrency=YOUR_YAPS_TOKEN_ADDRESS"; // Pancakeswap URL
  const yapsChartUrl = "https://www.dextools.io/app/en/bsc/pair-explorer/YOUR_YAPS_TOKEN_ADDRESS"; // DexTools chart URL

  // Sound effects
  const playSound = (soundFile) => {
    const audio = new Audio(`/mixkit-${soundFile}`);
    audio.play().catch(e => console.log("Audio play error:", e)); // Ignore autoplay restrictions
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
        backgroundImage: `url(${heroSpace})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
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
                "0 0 20px hsl(37 100% 64%), 0 0 40px hsl(37 100% 64%)",
                "0 0 30px hsl(37 100% 64%), 0 0 60px hsl(37 100% 64%)",
                "0 0 20px hsl(37 100% 64%), 0 0 40px hsl(37 100% 64%)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            YAPS COIN 🤟
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-4xl font-bold text-secondary text-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Where Memes Meet Money
          </motion.p>

          <motion.p 
            className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            The funniest, most unpredictable crypto experience in the galaxy! 
            HODL with laughter and maybe moon with us!
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button variant="hero" size="xl" className="group" onClick={handleBuyClick}>
              <Rocket className="mr-2 group-hover:animate-bounce" />
              Buy $YAPS
            </Button>
            <Button variant="neon" size="xl" className="group" onClick={handleChartClick}>
              <Sparkles className="mr-2 group-hover:animate-spin" />
              YAPS CHART
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
