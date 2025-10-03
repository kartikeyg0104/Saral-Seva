import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { ArrowRight, Users, Briefcase, GraduationCap, Heart, Sprout, Home, Sparkles, Target, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import schemesImage from "@/assets/schemes-icons.jpg";

const SchemesSection = () => {
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

    const element = document.getElementById('schemes');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  const schemeCategories = [
    {
      title: "Employment Schemes",
      icon: Briefcase,
      count: "45+ Schemes",
      description: "MGNREGA, PM-KISAN, Startup India, and more employment opportunities.",
      schemes: ["MGNREGA", "PM-KISAN", "Startup India", "MUDRA Loan"],
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Education & Skills",
      icon: GraduationCap,
      count: "35+ Schemes",
      description: "Scholarships, skill development, and educational support programs.",
      schemes: ["PM Scholarship", "Skill India", "Digital India", "Beti Bachao"],
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Healthcare",
      icon: Heart,
      count: "25+ Schemes",
      description: "Ayushman Bharat, health insurance, and medical assistance programs.",
      schemes: ["Ayushman Bharat", "PMJAY", "Mission Indradhanush", "Janani Suraksha"],
      color: "bg-success/10 text-success",
    },
    {
      title: "Agriculture",
      icon: Sprout,
      count: "30+ Schemes",
      description: "Farmer support, crop insurance, and agricultural development schemes.",
      schemes: ["PM-KISAN", "Crop Insurance", "Soil Health Card", "KCC"],
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Housing",
      icon: Home,
      count: "20+ Schemes",
      description: "Affordable housing, rural development, and shelter programs.",
      schemes: ["PM Awas Yojana", "PMAY-G", "PMAY-U", "Pradhan Mantri Gramin"],
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Social Welfare",
      icon: Users,
      count: "40+ Schemes",
      description: "Pension schemes, disability support, and social security programs.",
      schemes: ["APY", "PM-SYM", "NSAP", "Disability Pension"],
      color: "bg-success/10 text-success",
    },
  ];

  const eligibilityFilters = [
    "Age: 18-60 years",
    "Income: < ₹8 Lakhs",
    "State: All India",
    "Category: General",
  ];

  return (
    <section id="schemes" className="section-padding bg-gradient-to-br from-muted/30 via-accent/10 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 lg:mb-24 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center rounded-full border px-6 py-3 text-sm bg-primary/5 border-primary/20 mb-6 backdrop-blur-sm">
            <Target className="mr-2 h-4 w-4 text-primary animate-pulse" />
            <span className="font-medium">500+ Government Schemes</span>
            <Sparkles className="ml-2 h-3 w-3 text-secondary animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
            Discover Schemes <span className="text-gradient">Made for You</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
            Our <span className="text-primary font-semibold">AI-powered</span> recommendation engine suggests the most relevant schemes based on your profile, eligibility, and current life situation.
          </p>
          
          {/* Eligibility Demo */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {eligibilityFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={`px-4 py-2 text-sm font-medium backdrop-blur-sm border-2 card-hover ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <CheckCircle className="mr-2 h-3 w-3 text-success" />
                {filter}
              </Badge>
            ))}
          </div>
          
          <Button variant="hero" size="lg" className="button-hover animate-glow text-lg px-10 py-6 h-auto" asChild>
            <Link to="/schemes">
              <Target className="mr-2 h-5 w-5" />
              Check My Eligibility
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Schemes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20 lg:mb-32">
          {schemeCategories.map((category, index) => (
            <div
              key={index}
              className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <Card className="group card-hover h-full relative overflow-hidden border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-white via-white to-accent/20">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${category.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-soft`}>
                      <category.icon className="h-7 w-7" />
                    </div>
                    <Badge variant="outline" className="font-medium border-2">{category.count}</Badge>
                  </div>
                  <CardTitle className="text-xl lg:text-2xl group-hover:text-primary transition-colors">{category.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground mb-6 leading-relaxed">{category.description}</p>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Popular Schemes:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.schemes.map((scheme, schemeIndex) => (
                        <Badge key={schemeIndex} variant="secondary" className="text-xs px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                          {scheme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-6 group-hover:text-primary group-hover:bg-primary/5 transition-all button-hover" asChild>
                    <Link to="/schemes">
                      <span>View All Schemes</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Featured Image Section */}
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-accent/20 to-secondary/5 p-8 lg:p-16 border border-white/20 backdrop-blur-sm ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-secondary/10"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-primary/10 border-primary/30 mb-4 backdrop-blur-sm">
                  <Sparkles className="mr-2 h-4 w-4 text-primary animate-pulse" />
                  AI-Powered Intelligence
                </div>
                <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-gradient">AI-Powered</span> Scheme Matching
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Answer a few questions about yourself, and our intelligent system will instantly show you all the schemes you're eligible for - from central government to your state-specific benefits.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  "Personal profile-based recommendations",
                  "Real-time eligibility checking",
                  "Application status tracking"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success to-success/70 animate-pulse"></div>
                    <span className="font-medium text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="government" size="lg" className="button-hover text-lg px-8 py-6 h-auto" asChild>
                <Link to="/schemes">
                  <Target className="mr-2 h-5 w-5" />
                  Start Scheme Discovery
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl transform rotate-3 animate-float"></div>
              <div className="absolute inset-0 bg-gradient-secondary opacity-15 rounded-2xl transform -rotate-2 animate-float" style={{ animationDelay: '-2s' }}></div>
              
              <div className="relative overflow-hidden rounded-2xl shadow-government border-4 border-white/30 backdrop-blur-sm">
                <img
                  src={schemesImage}
                  alt="Government Schemes"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-success to-success/70 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce-slow">
                500+ Schemes
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-secondary to-secondary/70 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                AI Powered
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchemesSection;