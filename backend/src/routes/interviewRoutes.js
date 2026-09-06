import { Router } from 'express';
import { generateStructuredPlan } from '../services/geminiService.js';

const router = Router();

router.post('/prep', async (req, res) => {
  try {
    const { jobRole, company, experience, techStack } = req.body;

    const prompt = `Create an interview prep guide for:
- Role: ${jobRole}
- Target Company: ${company}
- Experience: ${experience}
- Tech Stack: ${techStack}

Include:
1. Top 5 Technical Questions with Model Answers
2. 2 Coding Challenges with solution outline
3. 1 System Design scenario
4. 3 Behavioral (STAR method) Questions
5. 14-Day Study Plan`;

    const prep = await generateStructuredPlan(
      req.user.uid,
      prompt,
      'You are a Technical Interview Lead.'
    );

    return res.json({ prep });
  } catch (error) {
    console.error('Interview prep error:', error);
    return res.status(500).json({ error: 'Failed to generate interview prep plan.' });
  }
});

export default router;
