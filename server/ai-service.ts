
import Anthropic from '@anthropic-ai/sdk';
import type { MoodEntry } from '@shared/schema';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
});

export class AIService {
  async analyzeMoodFromText(note: string): Promise<{ suggestedMood: string; confidence: number; emoji: string }> {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 150,
        messages: [{
          role: "user",
          content: `Analyze this mood note and suggest the most appropriate mood: "${note}"
          
          Respond with a JSON object containing:
          - suggestedMood: one of [Happy, Excited, Calm, Love, Sad, Tired, Angry, Anxious, Grateful, Energetic, Confused, Peaceful]
          - confidence: number between 0-1
          - emoji: appropriate emoji for the mood
          
          Example: {"suggestedMood": "Happy", "confidence": 0.85, "emoji": "😊"}`
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('AI mood analysis failed:', error);
      return { suggestedMood: 'Calm', confidence: 0.5, emoji: '😌' };
    }
  }

  async generateMoodInsights(entries: MoodEntry[]): Promise<string> {
    if (entries.length === 0) return "Start tracking your moods to get personalized insights!";

    try {
      const recentEntries = entries.slice(0, 10);
      const moodData = recentEntries.map(entry => ({
        mood: entry.mood,
        note: entry.note || '',
        date: entry.createdAt
      }));

      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: `Analyze these recent mood entries and provide helpful insights: ${JSON.stringify(moodData)}
          
          Provide a warm, encouraging analysis that includes:
          - Overall mood patterns you notice
          - Positive trends to celebrate
          - Gentle suggestions for emotional wellbeing
          - Keep it under 200 words and supportive in tone`
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('AI insights generation failed:', error);
      return "Keep tracking your moods! Every entry helps you understand your emotional patterns better.";
    }
  }

  async generateMoodRecommendations(currentMood: string, note?: string): Promise<string[]> {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: `Given someone is feeling "${currentMood}"${note ? ` with the note: "${note}"` : ''}, suggest 3 brief, actionable wellness activities.
          
          Respond with a JSON array of 3 short suggestions (max 50 chars each).
          Example: ["Take 5 deep breaths", "Go for a short walk", "Listen to uplifting music"]`
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('AI recommendations failed:', error);
      return ["Take a moment to breathe", "Practice gratitude", "Connect with someone you care about"];
    }
  }
}

export const aiService = new AIService();
