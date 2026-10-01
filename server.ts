import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { askGeminiFinancialAssistant } from './server/ai.ts';
import { requestVerificationCode, verifyCode } from './server/auth.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'Admin Money API',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Authentication: Send Verification Code to Email
app.post('/api/auth/send-verification-code', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'E-mail válido é obrigatório.' });
    }

    const result = await requestVerificationCode(email, name || '');
    res.json(result);
  } catch (error: any) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: error.message || 'Erro ao enviar código de verificação.' });
  }
});

// Authentication: Verify Code
app.post('/api/auth/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'E-mail e código são obrigatórios.' });
    }

    const result = verifyCode(email, code);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ success: true, verified: true });
  } catch (error: any) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: error.message || 'Erro ao validar código.' });
  }
});

// Financial AI Chat endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const reply = await askGeminiFinancialAssistant(prompt, context || {
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      savingsRate: 0,
      topCategories: [],
      upcomingBills: [],
      goals: [],
    });

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/assistant:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Serve frontend build in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Admin Money server running on port ${PORT}`);
});
