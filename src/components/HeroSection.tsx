import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles } from "lucide-react";
import heroSpace from "@/assets/hero-space.jpg";

export const HeroSection = () => {
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
            CheemsBlast 🚀
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-4xl font-bold text-secondary text-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The Funniest Coin in The Galaxy
          </motion.p>

          <motion.p 
            className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Fuel your laughter. Moon your wallet. Join the memetic revolution.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button variant="hero" size="xl" className="group">
              <Rocket className="mr-2 group-hover:animate-bounce" />
              Buy $CHEEMS
            </Button>
            <Button variant="neon" size="xl" className="group">
              <Sparkles className="mr-2 group-hover:animate-spin" />
              Join the Blast
            </Button>
          </motion.div>

          <motion.div
            className="pt-12"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-muted-foreground text-sm">Scroll to explore</p>
            <div className="w-6 h-10 border-2 border-primary rounded-full mx-auto mt-4 relative">
              <motion.div
                className="w-2 h-2 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 top-2"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
