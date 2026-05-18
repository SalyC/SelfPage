import { profile } from '../data/profile.js'

export async function askClaude(userMessage, systemPrompt) {
  await new Promise(resolve => setTimeout(resolve, 600))
  const msg = userMessage.toLowerCase()

  // Вопросы об опыте
  if (msg.includes('опыт') || msg.includes('лет') || msg.includes('года')) {
    return `У меня ${profile.experience}+ года опыта во фронтенде. Работал в командах от 4 до 7 человек, участвовал в трёх коммерческих проектах.`
  }

  // Вопросы о проектах
  if (msg.includes('проект') || msg.includes('проекты') || msg.includes('последний') ||
      msg.includes('wizard') || msg.includes('webcopy') || msg.includes('asana') || msg.includes('onewizard')) {

    // Конкретный проект Wizard Webcopy
    if (msg.includes('wizard') || msg.includes('webcopy')) {
      const p = profile.projects.find(p => p.title.toLowerCase().includes('wizard'))
      if (p) return `${p.title}: ${p.desc} Стек: ${p.stack.join(', ')}.`
    }
    // Конкретный проект Asana
    if (msg.includes('asana')) {
      const p = profile.projects.find(p => p.title.toLowerCase().includes('asana'))
      if (p) return `${p.title}: ${p.desc} Стек: ${p.stack.join(', ')}.`
    }
    // Конкретный проект OneWizard
    if (msg.includes('onewizard')) {
      const p = profile.projects.find(p => p.title.toLowerCase().includes('onewizard'))
      if (p) return `${p.title}: ${p.desc} Стек: ${p.stack.join(', ')}.`
    }
    // Общий ответ со всеми проектами
    return `Мои проекты:\n${profile.projects.map(p => `- ${p.title}: ${p.desc} (${p.stack.join(', ')})`).join('\n')}`
  }

  // Вопросы об AI
  if (msg.includes('ai') || msg.includes('claude') || msg.includes('ии') || msg.includes('инструмент')) {
    return `Я использую AI-инструменты: ${profile.aiTools.join(', ')}. Например, в Wizard Webcopy применял Claude API для анализа контента.`
  }

  // Вопросы о подходе к коду
  if (msg.includes('код') || msg.includes('подход') || msg.includes('стиль') || msg.includes('ревью')) {
    return profile.principles.slice(0, 3).join(' ') + ' Стараюсь писать чистый и понятный код.'
  }

  // Ответ по умолчанию
  return `Я фронтенд-разработчик на React, Next.js, TypeScript. Могу рассказать о проектах (Wizard Webcopy, Asana, OneWizard), опыте или использовании AI. Что именно вас интересует?`
}