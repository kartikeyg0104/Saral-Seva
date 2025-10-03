import { Button, Separator } from "@/components/ui";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram,
  ExternalLink,
  Shield,
  Award,
  Users,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();
  const quickLinks = [
    { name: "Find Schemes", href: "/schemes" },
    { name: "Apply Online", href: "/dashboard" },
    { name: "Track Application", href: "/dashboard" },
    { name: "Document Verification", href: "/verify" },
    { name: "File Complaint", href: "/complaints" },
    { name: "Government Events", href: "/events" },
  ];

  const governmentLinks = [
    { name: "Digital India", href: "https://digitalindia.gov.in" },
    { name: "MyGov India", href: "https://mygov.in" },
    { name: "India.gov.in", href: "https://india.gov.in" },
    { name: "PM Portal", href: "https://pmindia.gov.in" },
    { name: "e-Gov Portal", href: "https://egov.gov.in" },
    { name: "Jan Aushadhi", href: "https://janaushadhi.gov.in" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/dashboard" },
    { name: "User Guide", href: "/dashboard" },
    { name: "FAQs", href: "/dashboard" },
    { name: "Contact Support", href: "/complaints" },
    { name: "Report Issue", href: "/complaints" },
    { name: "Feedback", href: "/complaints" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Youtube, href: "#", name: "YouTube" },
    { icon: Instagram, href: "#", name: "Instagram" },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/5 rounded-full animate-float" style={{ animationDelay: '-2s' }}></div>
      </div>
      
      {/* Trust Badges */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-8 w-8 text-primary-foreground/80" />
              <span className="text-sm font-medium">Secure & Trusted</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Award className="h-8 w-8 text-primary-foreground/80" />
              <span className="text-sm font-medium">Government Verified</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Users className="h-8 w-8 text-primary-foreground/80" />
              <span className="text-sm font-medium">10M+ Citizens</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Globe className="h-8 w-8 text-primary-foreground/80" />
              <span className="text-sm font-medium">28 States</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/10 flex items-center justify-center animate-glow">
                <span className="text-primary-foreground font-bold text-lg">SS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl">Saral Seva</span>
                <span className="text-sm text-primary-foreground/70 font-medium">Government Services</span>
              </div>
            </div>
            
            <p className="text-primary-foreground/80 leading-relaxed">
              Unifying all government services, schemes, and citizen support through AI-powered technology. Making governance accessible to every Indian citizen.
            </p>
            
            <div className="space-y-4">
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 button-hover rounded-xl"
                    asChild
                  >
                    <a href={social.href} aria-label={social.name}>
                      <social.icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
              </div>
              
              <div className="inline-flex items-center rounded-full bg-primary-foreground/10 px-4 py-2 text-sm">
                <Shield className="mr-2 h-4 w-4" />
                Trusted by Government of India
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg lg:text-xl text-primary-foreground">Quick Services</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg lg:text-xl text-primary-foreground">Government Portals</h3>
            <ul className="space-y-4">
              {governmentLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    <ExternalLink className="h-3 w-3 group-hover:rotate-12 transition-transform" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg lg:text-xl text-primary-foreground">Help & Support</h3>
            
            <ul className="space-y-4">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="space-y-4 pt-4 border-t border-primary-foreground/20">
              <h4 className="font-semibold text-primary-foreground">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  <div className="p-2 bg-primary-foreground/10 rounded-lg">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">1800-XXX-XXXX</div>
                    <div className="text-sm opacity-80">Toll Free</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
                  <div className="p-2 bg-primary-foreground/10 rounded-lg">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">support@saralseva.gov.in</div>
                    <div className="text-sm opacity-80">24/7 Support</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-primary-foreground/80">
                  <div className="p-2 bg-primary-foreground/10 rounded-lg">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">New Delhi, India</div>
                    <div className="text-sm opacity-80">Government of India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-primary-foreground/20" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-primary-foreground/70 text-sm text-center lg:text-left">
            <div className="font-medium mb-2">© 2024 Saral Seva Pro</div>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Shield className="h-4 w-4" />
              <span>A Government of India Initiative. All rights reserved.</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-sm">
            <Link to="/profile" className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/profile" className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200 hover:underline">
              Terms of Service
            </Link>
            <Link to="/profile" className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200 hover:underline">
              Accessibility
            </Link>
            <Link to="/profile" className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200 hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
        
        {/* Additional compliance info */}
        <div className="mt-6 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/60">
          <p className="mb-2">
            This is an official Government of India website designed to provide citizen services.
          </p>
          <p>
            Website policies, terms and conditions are subject to change. Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;