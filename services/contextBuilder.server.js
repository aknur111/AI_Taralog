const Prompt = require('../models/Prompt');


class ContextBuilderService {
    async getSystemPrompt(readingType) {
        const prompt = await Prompt.findOne({ name: `${readingType}` }); 
        
        if (!prompt) { 
            throw new Error(`System prompt not found for type: ${readingType}`);
        }
        return prompt.content;
    }

    buildUserMessage(user_data, user_question, cards, additionalData){
        const positions = [
            'You (Your current self)',          
            'Past (Past influences)',           
            'Now (Present situation)',          
            'Future (What lies ahead)',         
            'Advice (Guidance for you)'          
        ];
        
        const cardsText = cards.map((card, index) => {
            const position = positions[index];
            return `${position}: ${card.name}${card.isReversed ? ' (Reversed)' : ''}`;
        }).join('\n');

        const context = ``;

        if (user_data){
            if (user_data.firstName){
                context += `User first name: ${user_data.firstName}\n`;
            }
            if (user_data.birthDate){
                context += `User birth date: ${user_data.birthDate}\n`;
            }
            if (user_data.birthPlace){
                context += `User birth place: ${user_data.birthPlace}\n`;
            }
            if (user_data.birthTime){
                context += `User birth time: ${user_data.birthTime}\n`;
            }
        }

        if (user_question){
            context += `User question: ${user_question}\n`;
        }

        if (cards){
            if (cards.length > 0){
                context += `Cards: ${cardsText}\n`;
            }
        }
        if (additionalData){
            context += `Data about user's love: ${additionalData.firstName||"Unknown"}, ${additionalData.birthDate||"Unknown"}, ${additionalData.birthPlace||"Unknown"}, ${additionalData.birthTime||"Unknown"}\n`;
        }

        return context;

    }}

    module.exports = new ContextBuilderService();