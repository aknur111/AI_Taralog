const { createXai } = require('@ai-sdk/xai');
const { generateText } = require('ai');

class GrokApiService {
  constructor() {
    this.xai = createXai({
      apiKey: process.env.XAI_API_KEY || process.env.GROK_API_KEY
    });
  }

  async getInterpretation(systemPrompt, userMessage) {
    try {
      const result = await generateText({
        model: this.xai('grok-3-mini-beta'),
        system: systemPrompt,
        prompt: userMessage,
      });

      return result.text;
    } catch (error) {
      throw new Error('Failed to get AI interpretation: ' + error.message);
    }
  }
}

module.exports = new GrokApiService();