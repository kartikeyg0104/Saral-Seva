import { Button, Card, CardContent } from "@/components/ui";
import { Search, FileCheck, MessageSquare, Calendar, Shield, Users, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroImage from "@/assets/hero-government-services.jpg";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const quickActions = [
    {
      title: "Find Schemes",
      description: "Discover schemes you're eligible for",
      icon: Search,
      color: "text-primary",
      href: "/schemes",
    },
    {
      title: "Verify Documents",
      description: "AI-powered document verification",
      icon: FileCheck,
      color: "text-success",
      href: "/verify",
    },
    {
      title: "File Complaint",
      description: "Report issues to authorities",
      icon: MessageSquare,
      color: "text-secondary",
      href: "/complaints",
    },
    {
      title: "Government Events",
      description: "Find events near you",
      icon: Calendar,
      color: "text-primary",
      href: "/events",
    },
  ];

  const stats = [
    { number: "500+", label: "Government Schemes" },
    { number: "10M+", label: "Citizens Served" },
    { number: "28", label: "States Covered" },
    { number: "24/7", label: "AI Assistant" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/20 to-muted/30 min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-secondary/20 to-success/20 rounded-full animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-primary/5 border-primary/20 backdrop-blur-sm">
                <Shield className="mr-2 h-4 w-4 text-primary animate-glow" />
                <span className="font-medium">Trusted by Government of India</span>
                <Sparkles className="ml-2 h-3 w-3 text-secondary animate-pulse" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                <span className="text-primary block">Saral Seva</span>
                <span className="bg-gradient-hero bg-clip-text text-transparent block">
                  One Platform,
                </span>
                <span className="text-foreground block">All Services</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Access all government schemes, verify documents, file complaints, and stay updated with events - all in one unified platform powered by <span className="text-primary font-semibold">AI</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6 h-auto button-hover animate-glow" asChild>
                <Link to="/schemes">
                  <Search className="mr-2 h-5 w-5" />
                  Find My Schemes
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto button-hover border-2" asChild>
                <Link to="/dashboard">
                  <Users className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 card-hover ${
                    isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className={`relative ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl transform rotate-3 animate-float"></div>
            <div className="absolute inset-0 bg-gradient-secondary opacity-5 rounded-2xl transform -rotate-2 animate-float" style={{ animationDelay: '-1s' }}></div>
            <div className="relative overflow-hidden rounded-2xl shadow-government border-4 border-white/20 backdrop-blur-sm">
              <img
                src={heroImage}
                alt="Government Services Platform"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center animate-bounce-slow">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-secondary to-secondary/70 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Quick Actions Cards */}
        <div className="mt-24 lg:mt-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-accent/50 border-accent mb-6 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary animate-pulse" />
              Popular Services
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">Quick Actions</h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">Get started with our most popular services in just one click</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <Link to={action.href}>
                  <Card className="group card-hover cursor-pointer h-full relative overflow-hidden border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-white via-white to-accent/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-6 lg:p-8 text-center relative z-10">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-accent/30 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-soft`}>
                        <action.icon className={`h-8 w-8 ${action.color} group-hover:animate-pulse`} />
                      </div>
                      <h3 className="font-bold text-lg lg:text-xl mb-3 group-hover:text-primary transition-colors">{action.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{action.description}</p>
                      <div className="mt-4 inline-flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium">Get Started</span>
                        <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;