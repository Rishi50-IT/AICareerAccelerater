import { Router } from 'express';
import { generateChatResponse } from '../services/geminiService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { history = [], message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const reply = await generateChatResponse(req.user.uid, history, message);
    return res.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'Failed to generate AI chat response.' });
  }
});

export default router;
