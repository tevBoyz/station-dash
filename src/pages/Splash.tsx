import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="w-32 h-32 mx-auto bg-card rounded-3xl shadow-elegant flex items-center justify-center">
          <img src="/logo.png" className="w-24 h-24  text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">A2 e-Corridor</h1>
          <p className="text-muted-foreground">Smart EV Charging Solutions</p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
