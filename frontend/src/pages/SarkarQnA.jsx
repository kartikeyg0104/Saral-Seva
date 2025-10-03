import { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { 
  Bot, 
  Send, 
  User, 
  MessageSquare,
  Sparkles,
  Languages,
  Zap,
  Shield,
  TrendingUp,
  BookOpen,
  HelpCircle
} from 'lucide-react';

const SarkarQnA = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      content: `**Welcome to SarkarQnA!** 🙏

Your AI-powered assistant for Indian Government Schemes and Services.

**What can I help you with today?**

🌾 **Agriculture** - PM-KISAN, Crop Insurance, Farmer Benefits
🏥 **Healthcare** - Ayushman Bharat, Medical Insurance
🏠 **Housing** - PMAY, Home Loans, Urban Development
🚀 **Startups** - Startup India, Funding, Tax Benefits
📚 **Education** - Scholarships, Skill Development
👨‍👩‍👧 **Social Welfare** - Pension Schemes, Women & Child

**Ask me anything!** I support English, Hindi, and Hinglish.`,
      timestamp: new Date(),
      suggestions: [
        "PM-KISAN eligibility",
        "Ayushman Bharat benefits",
        "Startup India registration",
        "Education scholarships"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'hinglish', label: 'Hinglish', flag: '🔄' }
  ];

  const quickQuestions = [
    {
      icon: "🌾",
      question: "Am I eligible for PM-KISAN?",
      category: "Agriculture"
    },
    {
      icon: "🏥",
      question: "What are Ayushman Bharat benefits?",
      category: "Healthcare"
    },
    {
      icon: "🏠",
      question: "How to apply for PMAY?",
      category: "Housing"
    },
    {
      icon: "🚀",
      question: "Tell me about Startup India",
      category: "Business"
    },
    {
      icon: "📚",
      question: "Available education scholarships",
      category: "Education"
    },
    {
      icon: "📄",
      question: "How to verify documents?",
      category: "Documents"
    }
  ];

  const features = [
    { icon: Languages, label: "Multilingual Support", description: "English, Hindi, Hinglish" },
    { icon: Shield, label: "Eligibility Checking", description: "Instant scheme matching" },
    { icon: TrendingUp, label: "Real-time Processing", description: "Quick AI responses" },
    { icon: BookOpen, label: "Source Citations", description: "Official government data" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // Direct call to Google Gemini API
      const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
      
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
      const suggestions = generateSuggestions(messageToSend.toLowerCase());

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        suggestions: ["Try again", "Ask different question", "Contact support"]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    if (isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Direct call to Google Gemini API
      const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
      
      const systemPrompt = `You are Saral Seva AI Assistant, a helpful AI for Indian government services. You help citizens with:
- Government schemes and eligibility (PM-KISAN, Ayushman Bharat, PMAY, Startup India, etc.)
- Application processes and status
- Document verification
- Government office locations
- Tax-related queries
- Digital services and e-governance

Be helpful, accurate, and provide specific guidance. Keep responses concise but informative. Always suggest next steps when possible.

User message: ${question}`;

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
      const suggestions = generateSuggestions(question.toLowerCase());

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        suggestions: ["Try again", "Ask different question", "Contact support"]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    if (isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Direct call to Google Gemini API
      const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
      
      const systemPrompt = `You are Saral Seva AI Assistant, a helpful AI for Indian government services. You help citizens with:
- Government schemes and eligibility (PM-KISAN, Ayushman Bharat, PMAY, Startup India, etc.)
- Application processes and status
- Document verification
- Government office locations
- Tax-related queries
- Digital services and e-governance

Be helpful, accurate, and provide specific guidance. Keep responses concise but informative. Always suggest next steps when possible.

User message: ${suggestion}`;

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
      const suggestions = generateSuggestions(suggestion.toLowerCase());

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        suggestions: ["Try again", "Ask different question", "Contact support"]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const generateSuggestions = (message) => {
    const suggestions = [];
    
    if (message.includes('scheme') || message.includes('eligibility')) {
      suggestions.push("Find schemes for me", "Check eligibility criteria", "Application process");
    }
    
    if (message.includes('document') || message.includes('verification')) {
      suggestions.push("Document verification help", "Required documents", "Upload documents");
    }
    
    if (message.includes('status') || message.includes('application')) {
      suggestions.push("Check application status", "Track my application", "Application timeline");
    }
    
    if (message.includes('office') || message.includes('location')) {
      suggestions.push("Find government offices", "Office timings", "Contact information");
    }
    
    if (message.includes('pm-kisan') || message.includes('kisan')) {
      suggestions.push("PM-KISAN eligibility", "PM-KISAN benefits", "How to apply", "Payment status");
    }
    
    if (message.includes('ayushman') || message.includes('health')) {
      suggestions.push("Ayushman Bharat benefits", "Find hospitals", "Get health card", "Claim process");
    }
    
    if (message.includes('startup')) {
      suggestions.push("Startup benefits", "Registration process", "Funding options", "Tax exemptions");
    }
    
    // Default suggestions if no specific keywords found
    if (suggestions.length === 0) {
      suggestions.push("Find schemes for me", "Check eligibility", "Document verification", "Track status");
    }
    
    return suggestions.slice(0, 4); // Limit to 4 suggestions
  };

  const renderMessageContent = (content) => {
    return content.split('\n').map((line, idx) => {
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={idx} className="mb-2 last:mb-0">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-bold text-base">{part}</strong> : part
            )}
          </p>
        );
      }
      
      if (line.trim().startsWith('- ')) {
        return (
          <p key={idx} className="mb-1 last:mb-0 ml-4">
            • {line.substring(2)}
          </p>
        );
      }
      
      if (line.match(/^\d+\.\s/)) {
        return (
          <p key={idx} className="mb-1 last:mb-0 ml-4">
            {line}
          </p>
        );
      }
      
      if (line.match(/^[🌾🏥🏠🚀📚👨‍👩‍👧��]/)) {
        return (
          <p key={idx} className="mb-2 last:mb-0 font-medium">
            {line}
          </p>
        );
      }
      
      return line.trim() ? (
        <p key={idx} className="mb-2 last:mb-0">
          {line}
        </p>
      ) : (
        <br key={idx} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SarkarQnA</h1>
                <p className="text-sm text-gray-600">AI-Powered Government Schemes Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-gray-600" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.flag} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span>Chat Assistant</span>
                  </CardTitle>
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Powered
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="h-[500px] overflow-y-auto overflow-x-hidden p-6 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                      {message.type === 'bot' && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-white ml-auto'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm break-words whitespace-pre-wrap overflow-wrap-anywhere">
                            {renderMessageContent(message.content)}
                          </div>
                          
                          <p className="text-xs opacity-70 mt-2">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        
                        {message.type === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs h-7 hover:bg-primary hover:text-white transition-colors"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t bg-white p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                      placeholder="Ask about government schemes..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="icon"
                      className="h-12 w-12 rounded-full"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Powered by AI • Government of India
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => handleQuickQuestion(q.question)}
                    className="w-full justify-start text-left h-auto py-3 hover:bg-primary/5"
                  >
                    <span className="text-2xl mr-3">{q.icon}</span>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{q.question}</p>
                      <p className="text-xs text-gray-500">{q.category}</p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.label}</p>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Secure & Verified</h3>
                  <p className="text-sm text-gray-700">
                    All information is sourced from official government portals and verified databases.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SarkarQnA;
