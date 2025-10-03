import { Loader2, Shield, Sparkles } from "lucide-react";

const LoadingSpinner = ({ size = "default", text = "Loading...", variant = "default" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <div className="h-16 w-16 rounded-full bg-primary/20 animate-pulse"></div>
            </div>
            <div className="relative h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center animate-glow">
              <Shield className="h-8 w-8 text-primary-foreground animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-primary">Saral Seva</h3>
            <p className="text-muted-foreground">Loading your government services...</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-secondary animate-pulse" />
          </div>
          <p className="text-muted-foreground font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {text && (
        <span className={`text-muted-foreground font-medium ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;