import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Coins, Image, Repeat } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Q1 2025",
    title: "Launch & Airdrop",
    description: "Token launch, initial CEX listings, and massive airdrop campaign",
    icon: Rocket,
    color: "hsl(37 100% 64%)",
  },
  {
    quarter: "Q2 2025",
    title: "MemeVerse Portal",
    description: "Interactive metaverse experience for the community",
    icon: Coins,
    color: "hsl(188 100% 43%)",
  },
  {
    quarter: "Q3 2025",
    title: "NFT Drop",
    description: "Exclusive CheemsBlast NFT collection with utility",
    icon: Image,
    color: "hsl(280 80% 60%)",
  },
  {
    quarter: "Q4 2025",
    title: "CheemsSwap DEX",
    description: "Launch our own decentralized exchange",
    icon: Repeat,
    color: "hsl(0 100% 60%)",
  },
];

export const RoadmapSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      <div className="container mx-auto">
        <motion.h2 
          className="text-5xl md:text-7xl font-display text-center mb-8 text-glow"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Roadmap 🗺️
        </motion.h2>

        <motion.p
          className="text-xl text-center text-muted-foreground mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          Our journey to the moon and beyond
        </motion.p>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2 hidden md:block" />

          {/* Rocket animation */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-20 hidden md:block"
            initial={{ top: "0%" }}
            animate={isInView ? { top: "100%" } : { top: "0%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <Rocket className="w-8 h-8 text-primary -rotate-45" />
          </motion.div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <motion.div
                    className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div 
                      className="bg-card border-2 rounded-3xl p-6 inline-block"
                      style={{ 
                        borderColor: item.color,
                        boxShadow: `0 0 20px ${item.color}40`
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4" style={{ justifyContent: isEven ? 'flex-end' : 'flex-start' }}>
                        <div 
                          className="p-3 rounded-full"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          <item.icon className="w-6 h-6" style={{ color: item.color }} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.quarter}</p>
                          <h3 className="text-2xl font-display" style={{ color: item.color }}>
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>

                  {/* Center dot */}
                  <motion.div
                    className="w-6 h-6 rounded-full border-4 border-background z-10 hidden md:block"
                    style={{ backgroundColor: item.color }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.2 }}
                    whileHover={{ scale: 1.5 }}
                  />

                  {/* Spacer for layout */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
