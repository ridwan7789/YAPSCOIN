import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { YAPS_CONFIG } from "@/lib/constants";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // In a real application, you might want to send this to an analytics service
    // sendErrorToAnalytics('404', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-card px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-4">
          <span className="text-5xl font-display">🛸</span>
        </div>
        <div>
          <h1 className="text-5xl font-display mb-2 text-primary">404</h1>
          <p className="text-2xl font-bold mb-2">Page Not Found</p>
          <p className="text-muted-foreground mb-4">
            The page you're looking for doesn't exist in the YAPS galaxy!
          </p>
        </div>
        <Button onClick={() => navigate('/')} className="w-full sm:w-auto px-8 py-6 text-lg font-bold rounded-full" variant="hero" size="lg">
          <Home className="mr-2 h-5 w-5" />
          Return to {YAPS_CONFIG.APP_NAME} Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
