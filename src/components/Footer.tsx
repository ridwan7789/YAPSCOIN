import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer 
      className="relative py-12 px-4 bg-gradient-to-t from-accent/10 to-background border-t border-accent/20"
      role="contentinfo"
      aria-label="Footer with copyright information and important links"
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Spinning coin */}
          <motion.img
            src="/assets/webp/yaps-logo.webp"
            alt="YAPS COIN logo spinning"
            className="w-16 h-16"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            aria-hidden="true" // Since the alt text provides the same context
          />

          {/* Text */}
          <motion.p
            className="text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            id="footer-copyright"
          >
            © {new Date().getFullYear()} YAPS COIN. Made with laughter & blockchain 🐕‍🦺
          </motion.p>

          {/* Links */}
          <div 
            className="flex gap-6 text-sm" 
            role="navigation" 
            aria-label="Additional resources"
          >
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
              whileHover={{ scale: 1.1 }}
              aria-describedby="footer-copyright"
            >
              Whitepaper
            </motion.a>
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
              whileHover={{ scale: 1.1 }}
              aria-describedby="footer-copyright"
            >
              Audit Report
            </motion.a>
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
              whileHover={{ scale: 1.1 }}
              aria-describedby="footer-copyright"
            >
              Smart Contract
            </motion.a>
          </div>

          {/* Disclaimer */}
          <p 
            className="text-xs text-muted-foreground text-center max-w-2xl"
            id="disclaimer"
          >
            YAPS COIN is for entertainment purposes only. This is not financial advice. 
            Always DYOR and only invest what you can afford to lose.
          </p>
        </div>
      </div>
    </footer>
  );
};
