import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const chatbotQuery = async (req, res) => {
  res.status(200).json({ 
    success: true, 
    data: {
      response: "I'm the Saral Seva AI assistant. How can I help you today?",
      suggestions: ["Find schemes for me", "Check application status", "Government office locations"]
    }, 
    message: 'Chatbot endpoint - coming soon' 
  });
};

router.post('/query', optionalAuth, chatbotQuery);

export default router;