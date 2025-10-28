import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Users, Zap } from "lucide-react";

const bubbles = [
  { text: "Market Crash Resistant", icon: Users },
  { text: "Community Driven", icon: Zap },
  { text: "Built with BNB", icon: Heart },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref} 
      className="relative py-24 px-4 overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto">
        <motion.h2 
          className="text-5xl md:text-7xl font-display text-center mb-16 text-glow"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          id="about-heading"
        >
          What is YAPS COIN?
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Character */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
            aria-hidden="true" // Decorative element
          >
            <motion.img
              src="/src/assets/webp/cheems-character.webp"
              alt="YAPS COIN character floating in space with animated effects"
              className="w-full max-w-lg mx-auto animate-float"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Bubbles */}
          <div className="space-y-8" role="list" aria-labelledby="features-heading">
            <h3 id="features-heading" className="sr-only">Key Features of YAPS COIN</h3>
            {bubbles.map((bubble, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
                role="listitem"
              >
                <motion.div
                  className="bg-card border-2 border-primary rounded-3xl p-6 box-glow-gold"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-4 rounded-full">
                      <bubble.icon 
                        className="w-8 h-8 text-primary" 
                        aria-hidden="true" 
                      />
                    </div>
                    <p className="text-2xl font-bold">{bubble.text}</p>
                  </div>
                </motion.div>
                
                {/* Speech bubble tail */}
                <div 
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-primary"
                  aria-hidden="true"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
          id="about-description"
        >
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            🤟YAPS is a meme crypto project built on confidence and optimism.<br />
            Our philosophy is simple: "Everything's OKAY."<br />
            Backed by a strong community, global support, and long-term vision,<br />
            YAPS is creating a fun, confident, and unstoppable ecosystem.<br />
            In the wild world of crypto — YAPS stays OKAY.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
