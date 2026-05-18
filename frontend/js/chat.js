let profile, askClaude;

try {
  const profileModule = await import('./data/profile.js');
  const anthropicModule = await import('./services/anthropic.js');
  profile = profileModule.profile;
  askClaude = anthropicModule.askClaude;
} catch (e) {
  console.warn('Импорты не найдены, использую встроенные мок-данные', e);
  profile = {
    name: 'Александр Астапов',
    role: 'Frontend Developer',
    location: 'Омск / Remote',
    experience: 1,
    stack: ['React', 'TypeScript', 'Next.js', 'Node.js'],
    aiTools: ['Anthropic Claude API', 'OpenAI', 'LangChain'],
    projects: [
      { title: 'Wizard Webcopy — анализ сайта конкурента', desc: 'Анализ сайта конкурента, парсинг и визуализация данных. Основной разработчик в команде из 4 человек.', stack: ['React', 'Next.js', 'Node.js', 'TypeScript'] },
      { title: 'Asana — сайт фестиваля', desc: 'Сайт фестиваля с интерактивной картой и расписанием. Разработчик в команде из 7 человек.', stack: ['Next.js', 'TypeScript', 'HTML/CSS/JS'] },
      { title: 'OneWizard — разработка сайтов и автоматизация заявок', desc: 'Разработка сайтов под ключ и автоматизация заявок через CRM. Разработчик в команде из 7 человек.', stack: ['React', 'Next.js', 'TypeScript', 'Node.js'] }
    ],
    principles: ['Пишет чистый, типизированный код', 'Предпочитает простые решения сложным', 'Пишет тесты для критической логики', 'Следит за производительностью']
  };

  askClaude = async (userMessage, systemPrompt) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const msg = userMessage.toLowerCase();
    if (msg.includes('опыт') || msg.includes('лет')) {
      return `У меня ${profile.experience}+ года опыта во фронтенде. Работал в командах от 4 до 7 человек.`;
    }
    if (msg.includes('проект') || msg.includes('проекты') || msg.includes('последний')) {
      if (msg.includes('wizard') || msg.includes('webcopy')) {
        const p = profile.projects[0];
        return `${p.title}: ${p.desc} Стек: ${p.stack.join(', ')}.`;
      }
      if (msg.includes('asana')) {
        const p = profile.projects[1];
        return `${p.title}: ${p.desc} Стек: ${p.stack.join(', ')}.`;
      }
      if (msg.includes('onewizard')) {
        const p = profile.projects[2];
        return `${p.title}: ${p.desc} Стек: ${p.stack.join(', ')}.`;
      }
      return `Мои проекты:\n${profile.projects.map(p => `- ${p.title}: ${p.desc} (${p.stack.join(', ')})`).join('\n')}`;
    }
    if (msg.includes('ai') || msg.includes('claude') || msg.includes('ии')) {
      return `Я использую AI-инструменты: ${profile.aiTools.join(', ')}.`;
    }
    if (msg.includes('код') || msg.includes('подход')) {
      return profile.principles.slice(0,3).join(' ');
    }
    return `Я фронтенд-разработчик на React, Next.js, TypeScript. Могу рассказать о проектах (Wizard Webcopy, Asana, OneWizard), опыте или использовании AI. Что именно вас интересует?`;
  };
}

const SYSTEM_PROMPT = `Ты — AI-ассистент, представляющий frontend-разработчика ${profile.name}.

Профиль разработчика:
- Имя: ${profile.name}
- Роль: ${profile.role}, ${profile.experience}+ года опыта
- Локация: ${profile.location}
- Стек: ${profile.stack?.join(', ') || 'React, TypeScript, Next.js'}
- AI-инструменты: ${profile.aiTools?.join(', ') || 'Anthropic Claude API'}

Проекты:
${profile.projects.map((p, i) => `${i + 1}. ${p.title} (${p.stack.join(', ')}). ${p.desc}`).join('\n')}

Подход к работе:
${profile.principles.map(p => `- ${p}`).join('\n')}

Отвечай от первого лица ("я"), коротко и конкретно, на русском языке.
Не придумывай детали, которых нет в профиле.
Если вопрос не по теме — мягко верни к теме разработки.`;

const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const suggestions = document.getElementById('suggestions');

let isLoading = false;

export function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
}

export function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

export function sendSuggestion(btn) {
  chatInput.value = btn.textContent;
  sendMessage();
}

function appendMsg(text, role) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${role}`;

  const ava = document.createElement('div');
  ava.className = 'msg-ava';
  ava.textContent = role === 'bot' ? 'АП' : 'Вы';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;

  if (role === 'error') {
    bubble.style.borderColor = '#FF5F5F';
    bubble.style.background = 'rgba(255, 95, 95, 0.1)';
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '↻ Отправить снова';
    retryBtn.className = 'retry-btn';
    retryBtn.style.marginTop = '8px';
    retryBtn.style.background = 'transparent';
    retryBtn.style.border = '1px solid var(--accent)';
    retryBtn.style.color = 'var(--accent)';
    retryBtn.style.padding = '4px 12px';
    retryBtn.style.borderRadius = '20px';
    retryBtn.style.cursor = 'pointer';
    retryBtn.onclick = () => {
      msgDiv.remove();
      sendMessage();
    };
    bubble.appendChild(retryBtn);
  }

  msgDiv.append(ava, bubble);
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
  const msg = document.createElement('div');
  msg.className = 'msg bot';
  msg.id = 'typingMsg';

  const ava = document.createElement('div');
  ava.className = 'msg-ava';
  ava.textContent = 'АП';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;

  msg.append(ava, bubble);
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingMsg')?.remove();
}

export async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || isLoading) return;

  isLoading = true;
  sendBtn.disabled = true;
  suggestions.style.display = 'none';
  chatInput.value = '';
  chatInput.style.height = 'auto';

  appendMsg(text, 'user');
  showTyping();

  try {
    const reply = await askClaude(text, SYSTEM_PROMPT);
    removeTyping();
    appendMsg(reply, 'bot');
  } catch (err) {
    console.error(err);
    removeTyping();
    appendMsg('Ошибка соединения. Попробуйте ещё раз.', 'error');
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }
}

window.sendMessage = sendMessage;
window.sendSuggestion = sendSuggestion;
window.handleKey = handleKey;
window.autoResize = autoResize;