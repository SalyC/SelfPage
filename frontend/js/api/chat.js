// api/chat.js — прокси для запросов к DeepSeek

export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, systemPrompt } = req.body;

    // Валидация данных
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }

    // Безопасно получаем API-ключ из переменных окружения Vercel
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
      console.error('API key is not configured');
      return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
    }

    // Делаем запрос к реальному API DeepSeek
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // или deepseek-coder
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error:', errorData);
      return res.status(response.status).json({ error: errorData.error?.message || 'Ошибка DeepSeek API' });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Отправляем ответ обратно на фронтенд
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}