import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const tokenomicsData = [
  { label: "Community Rewards", percentage: 3, color: "hsl(37 100% 64%)", description: "For holders and stakers" },
  { label: "Liquidity", percentage: 90, color: "hsl(188 100% 43%)", description: "Deep liquidity pools" },
  { label: "Marketing", percentage: 5, color: "hsl(280 80% 60%)", description: "Memes & growth" },
  { label: "Dev Team", percentage: 2, color: "hsl(0 100% 60%)", description: "Building the future" },
];

export const TokenomicsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden bg-card/50">
      <div className="container mx-auto">
        <motion.h2 
          className="text-5xl md:text-7xl font-display text-center mb-8 text-glow-gold"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Tokenomics 💰
        </motion.h2>

        <motion.p
          className="text-xl text-center text-muted-foreground mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          Transparent distribution for a fair launch
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Coin in center */}
              <motion.img
                src="/assets/webp/yaps-logo.webp"
                alt="YAPS COIN token logo in center of pie chart"
                className="absolute inset-0 m-auto w-32 h-32 z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Pie chart segments */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {tokenomicsData.map((segment, index) => {
                  const prevPercentages = tokenomicsData
                    .slice(0, index)
                    .reduce((sum, s) => sum + s.percentage, 0);
                  const startAngle = (prevPercentages / 100) * 360;
                  const endAngle = startAngle + (segment.percentage / 100) * 360;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);
                  
                  const largeArc = segment.percentage > 50 ? 1 : 0;
                  
                  return (
                    <motion.path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={segment.color}
                      opacity={hoveredIndex === null ? 0.8 : hoveredIndex === index ? 1 : 0.3}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className="cursor-pointer transition-all duration-300"
                      style={{ transformOrigin: "50% 50%" }}
                    />
                  );
                })}
              </svg>
            </div>
          </motion.div>

          {/* Legend */}
          <div className="space-y-6">
            {tokenomicsData.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <motion.div
                  className="bg-card border-2 rounded-2xl p-6"
                  style={{ 
                    borderColor: segment.color,
                    boxShadow: hoveredIndex === index ? `0 0 30px ${segment.color}50` : 'none'
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <h3 className="text-2xl font-bold">{segment.label}</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-muted-foreground">{segment.description}</p>
                    <p className="text-4xl font-display" style={{ color: segment.color }}>
                      {segment.percentage}%
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
