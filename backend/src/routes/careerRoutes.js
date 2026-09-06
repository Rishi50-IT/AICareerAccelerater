import { Router } from 'express';
import { generateStructuredPlan } from '../services/geminiService.js';

const router = Router();

router.post('/plan', async (req, res) => {
  try {
    const { education, skills, targetJob, experienceLevel, targetCompany, availableHours } = req.body;

    const prompt = `Create a complete career plan for:
- Education: ${education}
- Skills: ${skills}
- Target Role: ${targetJob}
- Level: ${experienceLevel}
- Target Company: ${targetCompany || 'General Tech'}
- Available Hours/Week: ${availableHours}

Include: Learning Roadmap, Required Skills, 2 Recommended Projects, DSA Preparation Plan, System Design & Interview Strategy, and Timeline.`;

    const plan = await generateStructuredPlan(
      req.user.uid,
      prompt,
      'You are a senior tech career strategist and engineering manager.'
    );

    return res.json({ plan });
  } catch (error) {
    console.error('Career planner error:', error);
    return res.status(500).json({ error: 'Failed to generate career plan.' });
  }
});

export default router;
