const { xai } = require('@ai-sdk/xai');
const { generateText } = require('ai');

class GrokApiService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.client = xai({
      apiKey: this.apiKey
    });
  }

  async getInterpretation(systemPrompt, user_message) {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY not configured');
    }

    try {
      const result = await generateText({
        model: this.client('grok-4.1-reasoning'), 
        system: systemPrompt,   
        prompt: userMessage,
        // temperature: 0.7,
        // maxTokens: 1000
      });

      return result.text;
    } catch (error) {
      console.error('Grok API failed:', error);
      throw new Error('Failed to get AI interpretation: ' + error.message);
    }
  }
}

module.exports = new GrokApiService();