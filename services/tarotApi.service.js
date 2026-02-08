const https = require('https');

class TarotApiService {
  async getRandomCards(count = 5) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'tarotapi.dev',
        port: 443,
        path: `/api/v1/cards/random?n=${count}`,
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            const cards = result.cards.map((card, index) => ({
              cardId: card.name_short,
              name: card.name,
              isReversed: Math.random() < 0.3, 
              position: `position_${index + 1}`,
              meaning_up: card.meaning_up,
              meaning_rev: card.meaning_rev
            }));
            resolve(cards);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }
}

module.exports = new TarotApiService();