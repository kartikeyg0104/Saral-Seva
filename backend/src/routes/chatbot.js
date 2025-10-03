import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const chatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Google Gemini AI integration
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      // Fallback response if API key is not configured
      const fallbackResponse = generateIntelligentFallback(message);
      return res.status(200).json({
        success: true,
        data: {
          response: fallbackResponse.response,
          suggestions: fallbackResponse.suggestions
        }
      });
    }

    // Create context-aware prompt for government services
    const systemPrompt = `You are Saral Seva AI Assistant, a helpful AI for Indian government services. You help citizens with:
    - Government schemes and eligibility
    - Application processes and status
    - Document verification
    - Government office locations
    - Tax-related queries
    - Digital services and e-governance
    
    Be helpful, accurate, and provide specific guidance. Keep responses concise but informative. Always suggest next steps when possible.
    
    User message: ${message}`;

    // Call Google Gemini API with better error handling
    console.log('Calling Gemini API with key:', GOOGLE_API_KEY ? 'Present' : 'Missing');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
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
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', response.status, errorData);
      throw new Error(`Google API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data).substring(0, 200));
    
    // Better response extraction with fallback
    let aiResponse;
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      aiResponse = data.candidates[0].content.parts?.[0]?.text;
    }
    
    if (!aiResponse) {
      console.warn('No AI response found, using fallback');
      throw new Error('No response from Gemini API');
    }

    // Generate contextual suggestions based on the query
    const suggestions = generateSuggestions(message.toLowerCase());

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        suggestions: suggestions
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Instead of returning 500, return 200 with intelligent fallback
    const fallbackResponse = generateIntelligentFallback(req.body.message);
    
    return res.status(200).json({
      success: true,
      data: {
        response: fallbackResponse.response,
        suggestions: fallbackResponse.suggestions,
        fallbackMode: true
      }
    });
  }
};

// Intelligent fallback response generator
const generateIntelligentFallback = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // PM-KISAN related queries
  if (lowerMessage.includes('pm-kisan') || lowerMessage.includes('pm kisan') || lowerMessage.includes('kisan')) {
    return {
      response: `**PM-KISAN Scheme Overview:**

The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a central government scheme that provides financial assistance to farmers.

**Key Benefits:**
- ₹6,000 per year in 3 equal installments
- Direct transfer to bank accounts
- Support for small and marginal farmers

**Eligibility:**
- Farmers with cultivable landholding
- Land ownership in farmer's name
- All farmer families (except excluded categories)

**How to Apply:**
1. Visit PM-KISAN portal: pmkisan.gov.in
2. Click on 'New Farmer Registration'
3. Provide Aadhaar number and details
4. Submit required documents

Would you like to know more about eligibility criteria or application process?`,
      suggestions: ["Check PM-KISAN eligibility", "How to apply for PM-KISAN", "PM-KISAN payment status", "Required documents"]
    };
  }
  
  // Ayushman Bharat queries
  if (lowerMessage.includes('ayushman') || lowerMessage.includes('health') || lowerMessage.includes('medical')) {
    return {
      response: `**Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY):**

A comprehensive health insurance scheme providing coverage for secondary and tertiary care hospitalization.

**Key Benefits:**
- Health coverage of ₹5 lakh per family per year
- Covers 1,400+ procedures
- Cashless treatment at empanelled hospitals
- No cap on family size or age

**Eligibility:**
- Based on SECC 2011 data
- Automatically eligible families receive benefits
- Check eligibility on pmjay.gov.in

**How to Check:**
1. Visit: https://pmjay.gov.in
2. Enter mobile number
3. Verify with OTP
4. Check eligibility status

Need help with eligibility check or finding empanelled hospitals?`,
      suggestions: ["Check Ayushman Bharat eligibility", "Find empanelled hospitals", "How to get Ayushman card", "Covered treatments"]
    };
  }
  
  // Startup India queries
  if (lowerMessage.includes('startup') || lowerMessage.includes('business') || lowerMessage.includes('entrepreneur')) {
    return {
      response: `**Startup India Scheme:**

An initiative to build a strong ecosystem for nurturing innovation and startups in India.

**Key Benefits:**
- Tax exemptions for 3 consecutive years
- Self-certification compliance
- IPR fast-tracking and 80% rebate on patents
- Access to funding and mentorship
- Relaxed norms for public procurement

**Eligibility:**
- Entity incorporated as a private limited company
- Up to 10 years from date of incorporation
- Annual turnover not exceeding ₹100 crore
- Working towards innovation/development

**How to Register:**
1. Visit: https://www.startupindia.gov.in
2. Click 'Register'
3. Fill startup details
4. Upload required documents
5. Get recognition certificate

Interested in tax benefits or funding opportunities?`,
      suggestions: ["Startup India benefits", "How to register startup", "Startup funding options", "Tax exemptions for startups"]
    };
  }
  
  // Document verification queries
  if (lowerMessage.includes('document') || lowerMessage.includes('verify') || lowerMessage.includes('aadhaar') || lowerMessage.includes('pan')) {
    return {
      response: `**Document Verification Services:**

I can help you with various document verification processes:

**Available Services:**
1. **Aadhaar Verification** - Verify and update Aadhaar details
2. **PAN Card** - Apply, verify, or link with Aadhaar
3. **Income Certificate** - Apply for income certificate
4. **Caste Certificate** - SC/ST/OBC certificate applications
5. **Domicile Certificate** - State residence proof

**Common Documents Required:**
- Identity Proof (Aadhaar, Voter ID, Passport)
- Address Proof (Utility bills, Rent agreement)
- Photographs (passport size)
- Application forms

**Quick Links:**
- Aadhaar: https://uidai.gov.in
- PAN: https://www.incometax.gov.in
- DigiLocker for documents: https://digilocker.gov.in

Which document would you like to verify or apply for?`,
      suggestions: ["Verify Aadhaar", "Apply for PAN card", "Income certificate", "Link Aadhaar-PAN"]
    };
  }
  
  // Eligibility checks
  if (lowerMessage.includes('eligible') || lowerMessage.includes('eligibility')) {
    return {
      response: `**Government Scheme Eligibility Checker:**

I can help you check eligibility for various government schemes based on:

**Criteria Considered:**
- Age and Gender
- Income Level
- Location (State/District)
- Category (General/SC/ST/OBC)
- Occupation
- Educational Qualification

**Popular Schemes by Category:**

**Agriculture:** PM-KISAN, PM Fasal Bima Yojana
**Education:** Scholarships, Skill Development
**Healthcare:** Ayushman Bharat, PMJAY
**Housing:** PMAY, Affordable Housing
**Business:** Startup India, MUDRA Loan
**Social Security:** PM-SYM, APY

To provide accurate eligibility information, please tell me:
1. Your age and occupation
2. Your state/district
3. Annual income range
4. Specific scheme you're interested in

Or ask about a specific scheme for detailed eligibility criteria!`,
      suggestions: ["Agriculture schemes", "Education schemes", "Healthcare schemes", "Business schemes"]
    };
  }
  
  // Application status queries
  if (lowerMessage.includes('status') || lowerMessage.includes('application') || lowerMessage.includes('track')) {
    return {
      response: `**Application Status Tracking:**

You can track the status of your government scheme applications:

**How to Check Status:**

1. **PM-KISAN:** Visit pmkisan.gov.in → Beneficiary Status
2. **Ayushman Bharat:** Visit pmjay.gov.in → Track Application
3. **Scholarships:** Visit scholarships.gov.in → Login → Track
4. **PAN Card:** Visit incometax.gov.in → Track Status
5. **Passport:** Visit passportindia.gov.in → Track Status

**Information Needed:**
- Application/Reference Number
- Registered Mobile Number
- Aadhaar Number (for some schemes)

**General Tracking:**
Most schemes provide status updates via:
- SMS to registered mobile
- Email notifications
- Online portals

Which scheme's application status would you like to track?`,
      suggestions: ["Track PM-KISAN status", "Track Ayushman application", "Scholarship status", "PAN card status"]
    };
  }
  
  // Default response
  return {
    response: `**Welcome to Saral Seva AI Assistant!** 🙏

I'm here to help you with Indian government services and schemes. I can assist you with:

**🎯 Popular Services:**
- **Scheme Information:** PM-KISAN, Ayushman Bharat, Startup India, PMAY
- **Eligibility Checks:** Find schemes you qualify for
- **Application Process:** Step-by-step guidance
- **Document Verification:** Aadhaar, PAN, certificates
- **Status Tracking:** Check your application status
- **Government Offices:** Find nearby locations

**💡 Example Questions:**
- "Am I eligible for PM-KISAN scheme?"
- "What are the benefits of Ayushman Bharat?"
- "How to apply for Startup India?"
- "Documents needed for income certificate"
- "Track my scholarship application"

**🌐 Multi-Language Support:**
You can ask questions in English, Hindi, or Hinglish!

What would you like to know about government schemes or services today?`,
    suggestions: ["Find schemes for me", "Check eligibility", "Document verification", "Track application status"]
  };
};

// Helper function to generate contextual suggestions
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
  
  if (message.includes('tax') || message.includes('income')) {
    suggestions.push("Tax benefits", "Income tax filing", "Tax calculation");
  }
  
  // Default suggestions if no specific keywords found
  if (suggestions.length === 0) {
    suggestions.push("Find schemes for me", "Check application status", "Document verification", "Government office locations");
  }
  
  return suggestions.slice(0, 4); // Limit to 4 suggestions
};

router.post('/query', optionalAuth, chatbotQuery);

export default router;