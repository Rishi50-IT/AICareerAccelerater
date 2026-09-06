import { Router } from 'express';
import { generateStructuredPlan } from '../services/geminiService.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { technology, difficulty, domain, goal } = req.body;

    const prompt = `Generate an in-depth software project specification:
- Core Tech Stack: ${technology}
- Difficulty Level: ${difficulty}
- Domain: ${domain}
- Primary Goal: ${goal}

Include: Project Title, Problem Statement, Key Feature Set, Architecture Overview, Database Schema (SQL/NoSQL), Step-by-Step Step Development Roadmap, and Production Deployment Strategy.`;

    const spec = await generateStructuredPlan(
      req.user.uid,
      prompt,
      'You are a Principal Software Architect.'
    );

    return res.json({ spec });
  } catch (error) {
    console.error('Project generator error:', error);
    return res.status(500).json({ error: 'Failed to generate project specification.' });
  }
});

export default router;
