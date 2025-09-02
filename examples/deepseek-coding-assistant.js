
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.deepseek.com/anthropic'
});

async function askCodingQuestion(question) {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `As a coding assistant: ${question}`
    }]
  });
  
  return response.content[0].text;
}

// Example usage
const answer = await askCodingQuestion("How do I optimize this React component for performance?");
console.log(answer);
