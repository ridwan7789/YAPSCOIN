import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Twitter } from "lucide-react";
import { YAPS_CONFIG } from "@/lib/constants";

// Function to play sound effects with better error handling
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

const handleTelegramClick = () => {
  playSound("dog-barking-twice-1.wav"); // Fun barking sound for Telegram
  // Allow default navigation to proceed
};

const handleTwitterClick = () => {
  playSound("arcade-retro-game-over-213.wav"); // Playful sound for Twitter
  // Allow default navigation to proceed
};

const socialLinks = [
  { name: "Telegram", icon: MessageCircle, color: "hsl(188 100% 43%)", emoji: "🤟", url: YAPS_CONFIG.SOCIAL_LINKS.telegram, onClick: handleTelegramClick },
  { name: "X (Twitter)", icon: Twitter, color: "hsl(37 100% 64%)", emoji: "🐦", url: YAPS_CONFIG.SOCIAL_LINKS.twitter, onClick: handleTwitterClick }, // Replace with actual Twitter handle if different
];

export const CommunitySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref} 
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-background to-card"
      aria-labelledby="community-heading"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: "radial-gradient(circle, hsl(37 100% 64%) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.h2 
          className="text-5xl md:text-7xl font-display text-center mb-8 text-glow-gold"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          id="community-heading"
        >
          Join Our Community! 🚀
        </motion.h2>

        <motion.p
          className="text-xl text-center text-muted-foreground mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          id="community-description"
        >
          Be part of the YAPS COIN revolution - where memes meet moonbags! 
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Dancing YAPS COIN Character */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
            aria-hidden="true" // Decorative element
          >
            <motion.img
              src="/src/assets/webp/cheems-character.webp"
              alt={YAPS_CONFIG.APP_NAME + " character dancing and welcoming new members"}
              className="w-full max-w-md mx-auto"
              animate={{
                rotate: [-5, 5, -5],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Floating emojis */}
            {["🚀", "🎉", "💎", "🔥", "🌙"].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 360],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                aria-hidden="true" // Decorative element
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>

          {/* Social Links */}
          <div className="space-y-6" role="list" aria-labelledby="social-links-heading">
            <h3 id="social-links-heading" className="sr-only">Social Media Links</h3>
            {socialLinks.map((social, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                role="listitem"
              >
                <a 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={social.onClick}
                  className="block"
                  aria-label={`Connect with us on ${social.name}`}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-20 text-xl font-bold group relative overflow-hidden"
                    style={{
                      borderColor: social.color,
                      borderWidth: '2px',
                    }}
                    aria-label={`Join us on ${social.name}`}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                      style={{ backgroundColor: social.color }}
                      aria-hidden="true"
                    />
                    <social.icon 
                      className="mr-3 w-8 h-8" 
                      style={{ color: social.color }} 
                      aria-hidden="true" 
                    />
                    <span className="flex-1">{social.name}</span>
                    <span className="text-3xl" aria-hidden="true">{social.emoji}</span>
                    <motion.div
                      className="absolute inset-0 border-4 rounded-md opacity-0 group-hover:opacity-100"
                      style={{ borderColor: social.color }}
                      initial={false}
                      whileHover={{
                        boxShadow: `0 0 30px ${social.color}80`,
                      }}
                      aria-hidden="true"
                    />
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
          role="group"
          aria-labelledby="stats-heading"
        >
          <h3 id="stats-heading" className="sr-only">Community Statistics</h3>
          {[
            { value: "50K+", label: "Holders" },
            { value: "$10M+", label: "Volume" },
            { value: "∞", label: "Fun" },
          ].map((stat, i) => (
            <div key={i} className="text-center" role="listitem">
              <motion.p
                className="text-4xl md:text-5xl font-display text-primary"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                aria-label={`${stat.value} ${stat.label}`}
              >
                {stat.value}
              </motion.p>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
