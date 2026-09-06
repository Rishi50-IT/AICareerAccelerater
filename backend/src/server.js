import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/authMiddleware.js';
import chatRoutes from './routes/chatRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// Healthcheck
app.get('/health', (req, res) => res.status(200).send('OK'));

// Authenticated Routes
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/career', authenticateToken, careerRoutes);
app.use('/api/project', authenticateToken, projectRoutes);
app.use('/api/interview', authenticateToken, interviewRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`AI Career Copilot backend running on port ${PORT}`);
});
