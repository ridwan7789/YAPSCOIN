import { useEffect } from "react";
import Swap from "@/components/Swap";
import { playSound } from "@/lib/sound";

const SwapPage = () => {
  useEffect(() => {
    document.title = "Yapswap Exchange - YAPS COIN";
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4 sm:px-6"
      style={{
        backgroundImage: "url('/assets/webp/baner-space.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <img 
            src="/assets/webp/yaps-logo.webp" 
            alt="YAPS Logo" 
            className="h-20 w-20 object-contain"
          />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Yapswap Exchange
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Swap your tokens seamlessly on the Yapswap decentralized exchange
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <div className="relative">
            <Swap />
            <img 
              src="/assets/webp/cheems-character.webp" 
              alt="Cheems Character" 
              className="absolute -bottom-20 -right-20 w-40 h-40 object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;