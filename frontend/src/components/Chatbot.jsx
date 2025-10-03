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
  Video,
  Languages,
  Shield,
  CheckCircle,
  XCircle,
  ExternalLink,
  Info
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
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [aiResponse, setAiResponse] = useState(null);
  const [showSources, setShowSources] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: Search, label: "Find Schemes", query: "What schemes am I eligible for?" },
    { icon: FileText, label: "Check Status", query: "How do I check my application status?" },
    { icon: HelpCircle, label: "Get Help", query: "I need help with document verification" },
    { icon: Phone, label: "Contact Info", query: "How can I contact government offices?" }
  ];

  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "hi", label: "हिंदी", flag: "🇮🇳" },
    { value: "hinglish", label: "Hinglish", flag: "🔄" }
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
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Direct call to Google Gemini API
      const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
      console.log('API Key loaded:', GOOGLE_API_KEY ? 'Yes' : 'No');
      
      if (!GOOGLE_API_KEY) {
        throw new Error('Google API key not found in environment variables');
      }
      
      const systemPrompt = `You are Saral Seva AI Assistant, a helpful AI for Indian government services. You help citizens with:
- Government schemes and eligibility (PM-KISAN, Ayushman Bharat, PMAY, Startup India, etc.)
- Application processes and status
- Document verification
- Government office locations
- Tax-related queries
- Digital services and e-governance

Be helpful, accurate, and provide specific guidance. Keep responses concise but informative. Always suggest next steps when possible.

User message: ${messageToSend}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      let aiResponse;
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        aiResponse = data.candidates[0].content.parts?.[0]?.text;
      }
      
      if (!aiResponse) {
        throw new Error('No response from Gemini API');
      }

      // Generate suggestions based on the query
      const suggestions = generateSmartSuggestions(messageToSend.toLowerCase());

      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions
      };
      
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // More specific error handling
      let errorMessage = "I'm experiencing technical difficulties. Please try again in a moment.";
      
      if (error.message?.includes('fetch')) {
        errorMessage = "Unable to connect to the AI service. Please check your internet connection and try again.";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "The request is taking longer than expected. Please try again.";
      } else if (error.message?.includes('403') || error.message?.includes('API key')) {
        errorMessage = "API configuration error. Please contact support.";
      }
      
      const errorResponse = {
        id: messages.length + 2,
        type: "bot",
        content: errorMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }

    setIsTyping(false);
  };

  const generateSmartSuggestions = (message) => {
    const suggestions = [];
    
    if (message.includes('scheme') || message.includes('eligibility')) {
      suggestions.push("Find schemes for me", "Check eligibility", "Application process");
    } else if (message.includes('document') || message.includes('verification')) {
      suggestions.push("Verify documents", "Required documents", "Upload documents");
    } else if (message.includes('status') || message.includes('application')) {
      suggestions.push("Track application", "Check status", "Application timeline");
    } else if (message.includes('pm-kisan') || message.includes('kisan')) {
      suggestions.push("PM-KISAN eligibility", "PM-KISAN benefits", "How to apply");
    } else if (message.includes('ayushman') || message.includes('health')) {
      suggestions.push("Ayushman benefits", "Find hospitals", "Get health card");
    } else if (message.includes('startup')) {
      suggestions.push("Startup benefits", "Registration", "Funding options");
    } else {
      suggestions.push("Find schemes", "Document verification", "Check status", "Get help");
    }
    
    return suggestions.slice(0, 4);
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
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/10 rounded-full">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">SarkarQnA</h3>
            <p className="text-xs opacity-80">AI Scheme Eligibility Bot</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Language Selector */}
          <div className="flex items-center gap-1 mr-2">
            <Languages className="h-4 w-4" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-primary-foreground/10 text-primary-foreground text-xs border-none rounded px-1 py-0.5"
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.flag} {option.label}
                </option>
              ))}
            </select>
          </div>
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
      <div className="p-3 border-b border-border bg-accent/30 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.query)}
              className="justify-start text-xs h-8 overflow-hidden"
            >
              <action.icon className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
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
                <div className="text-sm break-words whitespace-pre-wrap overflow-wrap-anywhere max-w-full">
                  {message.content.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-1 last:mb-0">
                      {line.includes('**') ? (
                        line.split('**').map((part, i) => 
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )
                      ) : line.startsWith('- ') ? (
                        <span>• {line.substring(2)}</span>
                      ) : (
                        line || '\u00A0'
                      )}
                    </p>
                  ))}
                </div>
                
                {/* AI Response Metadata */}
                {message.type === 'bot' && message.confidence && (
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Confidence: {message.confidence}%</span>
                    </div>
                    {message.sources && message.sources.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSources(!showSources)}
                        className="h-5 px-2 text-xs"
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Sources ({message.sources.length})
                      </Button>
                    )}
                  </div>
                )}
                
                <p className={`text-xs mt-1 opacity-70`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
              
              {/* Sources */}
              {message.type === 'bot' && message.sources && showSources && (
                <div className="mt-2 p-2 bg-accent/50 rounded-lg mr-2">
                  <h4 className="text-xs font-semibold mb-2">Sources:</h4>
                  {message.sources.map((source, index) => (
                    <div key={index} className="text-xs mb-1 flex items-center gap-2">
                      <ExternalLink className="h-3 w-3" />
                      <span>{source.schemeName}</span>
                      <span className="opacity-60">({Math.round(source.similarity * 100)}% match)</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Relevant Schemes */}
              {message.type === 'bot' && message.relevantSchemes && message.relevantSchemes.length > 0 && (
                <div className="mt-2 space-y-2 mr-2">
                  <h4 className="text-xs font-semibold">Relevant Schemes:</h4>
                  {message.relevantSchemes.slice(0, 3).map((scheme, index) => (
                    <div key={index} className="p-2 bg-accent/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{scheme.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(scheme.similarity * 100)}% match
                        </Badge>
                      </div>
                      <p className="text-xs opacity-70 mt-1">{scheme.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
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
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full pl-3 pr-12 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm overflow-hidden"
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