export const profile = {
  name:       'Александр Астапов',
  role:       'Frontend Developer',
  location:   'Омск / Remote',
  experience: 1,
  email:      'gmontherakbot@gmail.com',

  stack: [
    'React 18', 'TypeScript', 'Next.js 14', 'Remix', 'Vite',
    'Redux', 'React Query', 'Tailwind CSS', 'Framer Motion',
    'Radix UI', 'RestAPI', 'Node.js', 'Prisma',
    'Jest', 'Playwright', 'Docker', 'GitHub Actions',
  ],

  aiTools: ['Anthropic Claude API', 'OpenAI', 'LangChain'],

  projects: [
    {
      id: '001',
      year: 2025,
      title: 'Wizard Webcopy — анализ сайта конкурента',
      desc: 'Анализ сайта конкурента, парсинг и визуализация данных. Основной разработчик в команде из 4 человек.',
      stack: ['React', 'Next.js', 'Node.js', 'TypeScript'],
      url: '#',
    },
    {
      id: '002',
      year: 2025,
      title: 'Asana — сайт фестиваля',
      desc: 'Сайт фестиваля с интерактивной картой и расписанием. Разработчик в команде из 7 человек.',
      stack: ['Next.js', 'TypeScript', 'HTML/CSS/JS'],
      url: '#',
    },
    {
      id: '003',
      year: 2025,
      title: 'OneWizard — разработка сайтов и автоматизация заявок',
      desc: 'Разработка сайтов под ключ и автоматизация заявок через CRM. Разработчик в команде из 7 человек.',
      stack: ['React', 'Next.js', 'TypeScript', 'Node.js'],
      url: '#',
    },
  ],

  principles: [
    'Пишет чистый, типизированный код, который понятен на code review',
    'Предпочитает простые решения сложным',
    'Пишет тесты для критической логики',
    'Следит за производительностью: Lighthouse 90+, Web Vitals',
    'Активно использует AI-инструменты для ускорения разработки',
  ],
}