import { motion } from "framer-motion";
import coinIcon from "@/assets/coin-icon.png";

export const Footer = () => {
  return (
    <footer className="relative py-12 px-4 bg-gradient-to-t from-accent/10 to-background border-t border-accent/20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Spinning coin */}
          <motion.img
            src={coinIcon}
            alt="Cheems Coin"
            className="w-16 h-16"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Text */}
          <motion.p
            className="text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2025 CheemsBlast. Made with laughter & blockchain 😂⛓️
          </motion.p>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Whitepaper
            </motion.a>
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Audit
            </motion.a>
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Contract
            </motion.a>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center max-w-2xl">
            Cryptocurrency investments carry risk. Do your own research. CheemsBlast is a meme token for entertainment purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};
