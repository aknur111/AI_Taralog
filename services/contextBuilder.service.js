const Prompt = require('../models/Prompt');

class ContextBuilderService {
  async getSystemPrompt(readingType) {
    const prompt = await Prompt.findOne({ name: readingType });
    
    if (!prompt) {
      throw new Error(`System prompt not found for type: ${readingType}`);
    }
    return prompt.content;
  }

  buildUserMessage(userData, question, cards = [], additionalData = null, language = 'en') {
    const positions = language === 'ru' 
      ? ['Вы (Ваша суть)', 'Прошлое', 'Настоящее', 'Будущее', 'Совет']
      : ['You (Your essence)', 'Past', 'Present', 'Future', 'Advice'];
    
    let context = `Language: ${language === 'ru' ? 'Russian' : 'English'}\n`;
    context += `Please respond in ${language === 'ru' ? 'Russian' : 'English'}.\n\n`;

    if (userData) {
      if (userData.firstName) {
        context += `Client name: ${userData.firstName}\n`;
      }
      if (userData.lastName) {
        context += `Client surname: ${userData.lastName}\n`;
      }
      if (userData.gender) {
        const genderLabel = userData.gender === 'female' ? 'Female' : userData.gender === 'male' ? 'Male' : 'Other';
        context += `Gender: ${genderLabel}\n`;
      }
      if (userData.birthDate) {
        context += `Birth date: ${userData.birthDate}\n`;
      }
      if (userData.birthPlace) {
        context += `Birth place: ${userData.birthPlace}\n`;
      }
      if (userData.birthTime) {
        context += `Birth time: ${userData.birthTime}\n`;
      }
    }

    if (question) {
      context += `\nQuestion: ${question}\n`;
    }

    if (cards && cards.length > 0) {
      context += `\nTarot Spread (Five Card Cross):\n`;
      cards.forEach((card, index) => {
        const position = positions[index] || `Position ${index + 1}`;
        const reversed = card.isReversed 
          ? (language === 'ru' ? ' (Перевёрнута)' : ' (Reversed)') 
          : '';
        context += `${position}: ${card.name}${reversed}\n`;
      });
    }

    if (additionalData) {
      if (additionalData.firstName || additionalData.birthDate) {
        context += `\nPartner information:\n`;
        if (additionalData.firstName) context += `Name: ${additionalData.firstName}\n`;
        if (additionalData.lastName) context += `Surname: ${additionalData.lastName}\n`;
        if (additionalData.gender) {
          const genderLabel = additionalData.gender === 'female' ? 'Female' : additionalData.gender === 'male' ? 'Male' : 'Other';
          context += `Gender: ${genderLabel}\n`;
        }
        if (additionalData.birthDate) context += `Birth date: ${additionalData.birthDate}\n`;
        if (additionalData.birthPlace) context += `Birth place: ${additionalData.birthPlace}\n`;
        if (additionalData.birthTime) context += `Birth time: ${additionalData.birthTime}\n`;
      }
    }

    return context.trim();
  }
}

module.exports = new ContextBuilderService();