import { useState, useRef, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { 
  Bot, 
  Send, 
  User, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  Settings,
  MessageSquare,
  Zap,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Minimize2,
  Maximize2,
  X,
  HelpCircle,
  Star,
  Search,
  Phone,
  Video
} from "lucide-react";

const Chatbot = ({ isMinimized = false, onToggleMinimize, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI assistant for government services. I can help you with scheme eligibility, application processes, document verification, and more. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Check scheme eligibility",
        "Document verification help",
        "Application status",
        "Find government offices"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: Search, label: "Find Schemes", query: "What schemes am I eligible for?" },
    { icon: FileText, label: "Check Status", query: "How do I check my application status?" },
    { icon: HelpCircle, label: "Get Help", query: "I need help with document verification" },
    { icon: Phone, label: "Contact Info", query: "How can I contact government offices?" }
  ];

  const knowledgeBase = {
    "scheme eligibility": "To check scheme eligibility, I need some information about you. Could you tell me your age, state, occupation, and annual income? This will help me suggest the most relevant schemes.",
    "document verification": "I can help you verify documents using our AI-powered system. You can upload documents like Aadhaar, PAN, Passport, etc. Would you like me to guide you through the verification process?",
    "application status": "To check your application status, please provide your application reference number or the scheme name you applied for. I can also help you track multiple applications.",
    "pm kisan": "PM-KISAN is a scheme for farmers with landholding up to 2 hectares. It provides ₹6,000 per year in 3 installments. Are you a farmer looking to apply or check eligibility?",
    "ayushman bharat": "Ayushman Bharat provides health coverage of ₹5 lakh per family per year. Eligibility is based on SECC 2011 data. Would you like me to check if your family is eligible?",
    "startup india": "Startup India offers various benefits including tax exemptions, funding support, and simplified procedures. Do you have a startup or planning to start one?",
    "pmay": "Pradhan Mantri Awas Yojana provides housing assistance to eligible families. Benefits vary from ₹1.2 lakh to ₹2.67 lakh based on category and location."
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let response = "I understand you're asking about government services. Let me help you with that.";
    let suggestions = [];

    // Simple keyword matching for demo
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (input.includes(key.toLowerCase()) || key.toLowerCase().includes(input)) {
        response = value;
        break;
      }
    }

    // Add contextual suggestions
    if (input.includes("scheme") || input.includes("eligibility")) {
      suggestions = ["Show me agriculture schemes", "Education schemes", "Healthcare schemes", "Apply for PM-KISAN"];
    } else if (input.includes("document")) {
      suggestions = ["Verify Aadhaar", "Check PAN status", "Upload documents", "Required documents list"];
    } else if (input.includes("status")) {
      suggestions = ["Track application", "Check payment status", "Update mobile number", "Download certificate"];
    } else {
      suggestions = ["Find schemes for me", "Document verification", "Application help", "Contact support"];
    }

    return {
      id: messages.length + 2,
      type: "bot",
      content: response,
      timestamp: new Date(),
      suggestions: suggestions
    };
  };

  const handleQuickAction = (query) => {
    setInputMessage(query);
    handleSendMessage();
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full h-14 w-14 shadow-lg"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/10 rounded-full">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-80">Government Services Helper</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMinimize}
            className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-border bg-accent/30">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.query)}
              className="justify-start text-xs h-8"
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-2'
                    : 'bg-muted mr-2'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="mr-2 mb-1 text-xs h-7"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Avatar */}
            <div className={`flex-shrink-0 ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 mr-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full pl-3 pr-12 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoiceInput}
                className={`h-6 w-6 ${isListening ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                <Mic className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="icon"
            className="h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Powered by AI • Government of India</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;