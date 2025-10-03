import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { 
  Bot, 
  FileCheck, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Shield, 
  Bell, 
  Smartphone,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('#services-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  const services = [
    {
      title: "AI Assistant",
      description: "24/7 chatbot for instant help with schemes, eligibility, and applications.",
      icon: Bot,
      features: ["Natural language queries", "Eligibility checks", "Application guidance", "Status tracking"],
      color: "text-primary",
      bgGradient: "from-primary/10 to-primary/5",
      href: "/dashboard", // AI Assistant will be available on dashboard
    },
    {
      title: "Document Verification",
      description: "AI-powered verification to detect fake documents and ensure authenticity.",
      icon: FileCheck,
      features: ["Instant verification", "Fraud detection", "Government database check", "Digital signatures"],
      color: "text-success",
      bgGradient: "from-success/10 to-success/5",
      href: "/verify",
    },
    {
      title: "Smart Complaints",
      description: "File complaints that automatically reach the right authorities via social media.",
      icon: MessageSquare,
      features: ["Auto-routing", "Twitter integration", "Progress tracking", "Resolution updates"],
      color: "text-secondary",
      bgGradient: "from-secondary/10 to-secondary/5",
      href: "/complaints",
    },
    {
      title: "Location Services",
      description: "Find government offices, scheme centers, and event venues near you.",
      icon: MapPin,
      features: ["Google Maps integration", "Real-time directions", "Office hours", "Contact details"],
      color: "text-primary",
      bgGradient: "from-primary/10 to-primary/5",
      href: "/locations",
    },
    {
      title: "Event Management",
      description: "Stay updated with government events, workshops, and training programs.",
      icon: Calendar,
      features: ["Event calendar", "Registration assistance", "Reminders", "Check-in system"],
      color: "text-success",
      bgGradient: "from-success/10 to-success/5",
      href: "/events",
    },
    {
      title: "Security & Privacy",
      description: "End-to-end encryption and secure handling of all your personal data.",
      icon: Shield,
      features: ["Data encryption", "Secure login", "Privacy controls", "Audit trails"],
      color: "text-secondary",
      bgGradient: "from-secondary/10 to-secondary/5",
      href: "/profile", // Privacy settings will be in profile
    },
  ];

  const keyFeatures = [
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized for smartphones with offline capabilities for rural areas.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Personalized alerts for new schemes, deadlines, and updates.",
    },
    {
      icon: Shield,
      title: "Government Verified",
      description: "Official partnership with Government of India for authentic data.",
    },
  ];

  return (
    <section id="services-section" className="section-padding bg-gradient-to-br from-background via-muted/20 to-accent/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-gradient-to-br from-secondary/10 to-transparent rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 -left-20 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 lg:mb-24 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center rounded-full border px-6 py-3 text-sm bg-secondary/5 border-secondary/20 mb-6 backdrop-blur-sm">
            <Bot className="mr-2 h-4 w-4 text-secondary animate-pulse" />
            <span className="font-medium">AI-Powered Services</span>
            <Sparkles className="ml-2 h-3 w-3 text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
            <span className="text-gradient">Comprehensive</span> Digital Services
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            From <span className="text-primary font-semibold">AI assistance</span> to document verification, our platform provides all the tools you need to interact with government services efficiently and securely.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24 lg:mb-32">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <Card className="group card-hover h-full relative overflow-hidden border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-white via-white to-accent/20">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-accent/30 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-soft`}>
                    <service.icon className={`h-8 w-8 ${service.color} group-hover:animate-pulse`} />
                  </div>
                  <CardTitle className="text-xl lg:text-2xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-6">
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Key Features:
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-success to-success/70 animate-pulse"></div>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button variant="ghost" className="w-full group-hover:text-primary group-hover:bg-primary/5 transition-all button-hover" asChild>
                    <Link to={service.href}>
                      <span>Explore Service</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Key Features Banner */}
        <div className={`relative bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 rounded-3xl p-8 lg:p-16 border border-white/20 backdrop-blur-sm overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-secondary/10"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border px-6 py-3 text-sm bg-primary/10 border-primary/30 mb-6 backdrop-blur-sm">
                <Globe className="mr-2 h-4 w-4 text-primary animate-pulse" />
                <span className="font-medium">Trusted Platform</span>
                <Sparkles className="ml-2 h-3 w-3 text-secondary animate-pulse" />
              </div>
              <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                Why Choose <span className="text-gradient">Saral Seva Pro</span>?
              </h3>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Built with cutting-edge technology and deep understanding of citizen needs, we're revolutionizing how Indians access government services.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-8 lg:gap-12 mb-16">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-medium animate-glow">
                    <feature.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center space-y-6">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-success" />
                  <span className="font-medium">10M+ Citizens Trust Us</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="font-medium">Government Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-success" />
                  <span className="font-medium">28 States Coverage</span>
                </div>
              </div>
              
              <Button variant="hero" size="lg" className="button-hover animate-glow text-lg px-10 py-6 h-auto" asChild>
                <Link to="/dashboard">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;