import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui";

const ResponsiveModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "default",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ""
}) => {
  const modalRef = useRef(null);

  const sizeClasses = {
    sm: "max-w-sm",
    default: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl"
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in-up" />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]} 
          bg-background rounded-t-2xl sm:rounded-2xl 
          shadow-government border border-border
          max-h-[90vh] sm:max-h-[85vh]
          animate-slide-in-right sm:animate-fade-in-up
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="button-hover"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveModal;