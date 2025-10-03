import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Error Icon */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <div className="h-20 w-20 mx-auto rounded-full bg-destructive/20"></div>
              </div>
              <div className="relative h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-destructive/10 to-destructive/5 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
            </div>

            {/* Error Content */}
            <div className="space-y-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                We encountered an unexpected error while loading this page. 
                Don't worry, our team has been notified and we're working to fix it.
              </p>
            </div>

            {/* Error Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={this.handleRetry}
                  className="button-hover"
                  variant="hero"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                
                <Button 
                  variant="outline" 
                  className="button-hover"
                  asChild
                >
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </div>
              
              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Show technical details
                  </summary>
                  <div className="mt-4 p-4 bg-muted rounded-lg text-xs font-mono">
                    <div className="text-destructive font-semibold mb-2">
                      {this.state.error.toString()}
                    </div>
                    <div className="text-muted-foreground whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                </details>
              )}
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                If this problem persists, please{' '}
                <Link 
                  to="/complaints" 
                  className="text-primary hover:underline font-medium"
                >
                  contact our support team
                </Link>
                {' '}for assistance.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;