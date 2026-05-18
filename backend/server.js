require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-sonnet-20240229';

const requestLimits = new Map();
const RATE_LIMIT = 10; 
const RATE_WINDOW = 60 * 1000;

app.post('/api/chat', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress;
    const now = Date.now();
    const windowStart = now - RATE_WINDOW;
    if (requestLimits.has(ip)) {
      const requests = requestLimits.get(ip).filter(t => t > windowStart);
      if (requests.length >= RATE_LIMIT) {
        return res.status(429).json({ error: 'Слишком много запросов. Подождите минуту.' });
      }
      requests.push(now);
      requestLimits.set(ip, requests);
    } else {
      requestLimits.set(ip, [now]);
    }

    const { message, systemPrompt } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Сообщение слишком длинное (макс. 2000 символов)' });
    }
    if (!systemPrompt || typeof systemPrompt !== 'string') {
      return res.status(400).json({ error: 'System prompt is required' });
    }
    if (!ANTHROPIC_API_KEY) {
      console.error('API key not set');
      return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Anthropic API error ${response.status}: ${errorText}`);
      return res.status(response.status).json({ error: 'Ошибка Anthropic API' });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Извините, не удалось получить ответ.';
    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend запущен на http://localhost:${PORT}`);
});