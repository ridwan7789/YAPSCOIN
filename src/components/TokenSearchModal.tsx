import { useState, useEffect, useMemo } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { TokenInfo, COMMON_BSC_TOKENS, fetchPancakeSwapTokens, searchTokens } from "@/utils/tokenList";
import { useWallet } from "@/hooks/useWallet";

interface TokenSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectToken: (token: TokenInfo) => void;
  title: string;
  subtitle?: string;
}

const TokenSearchModal = ({ 
  open, 
  onOpenChange, 
  onSelectToken,
  title,
  subtitle 
}: TokenSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { provider } = useWallet();

  // Fetch common tokens on mount
  useEffect(() => {
    if (open) {
      setTokens(COMMON_BSC_TOKENS);
    }
  }, [open]);

  // Search function
  const searchTokensList = async (query: string) => {
    setLoading(true);
    try {
      if (query.trim() === "") {
        // Show common tokens if search is empty
        setTokens(COMMON_BSC_TOKENS);
      } else {
        const results = await searchTokens(query);
        setTokens(results);
      }
    } catch (error) {
      console.error("Error searching tokens:", error);
      setTokens(COMMON_BSC_TOKENS);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      searchTokensList(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return COMMON_BSC_TOKENS;
    
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tokens, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md max-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search name or paste address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white pl-10 py-2"
          />
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="overflow-y-auto max-h-80">
            {filteredTokens.length > 0 ? (
              <div className="space-y-1">
                {filteredTokens.map((token) => (
                  <div
                    key={token.address}
                    onClick={() => {
                      onSelectToken(token);
                      onOpenChange(false);
                    }}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    {token.logoURI ? (
                      <img 
                        src={token.logoURI} 
                        alt={token.symbol} 
                        className="w-8 h-8 rounded-full mr-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://tokens.1inch.io/0x0000000000000000000000000000000000000000.png`;
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">{token.symbol.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{token.symbol}</div>
                      <div className="text-sm text-gray-400 truncate">{token.name}</div>
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-[100px]">
                      {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No tokens found</p>
                <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TokenSearchModal;