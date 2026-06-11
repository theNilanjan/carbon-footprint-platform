/**
 * AI Insights Service
 * Integrates with Claude/OpenAI for personalized recommendations
 */

import axios from 'axios';
import type { Recommendation } from '../../types.js';

export class AIInsightsService {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
  }

  /**
   * Generate personalized insights using AI
   */
  async generateInsights(
    emissions: Record<string, number>,
    activities: Array<{ category: string; type: string; value: number }>
  ): Promise<Recommendation[]> {
    // If no API key, return fallback recommendations
    if (!this.apiKey) {
      return this.getFallbackRecommendations(emissions);
    }

    try {
      const prompt = this.buildPrompt(emissions, activities);

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful environmental advisor. Provide specific, actionable recommendations to reduce carbon footprint. Respond in JSON format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return this.parseAIResponse(response.data);
    } catch (error) {
      console.error('AI insights error:', error);
      return this.getFallbackRecommendations(emissions);
    }
  }

  /**
   * Build prompt for AI
   */
  private buildPrompt(
    emissions: Record<string, number>,
    activities: Array<{ category: string; type: string; value: number }>
  ): string {
    return `
Based on the following carbon emissions data, provide 3-5 personalized recommendations to reduce environmental impact:

Total Emissions by Category:
${Object.entries(emissions)
  .map(([category, value]) => `- ${category}: ${value.toFixed(2)} kg CO₂`)
  .join('\n')}

Recent Activities:
${activities
  .slice(-5)
  .map((a) => `- ${a.category}: ${a.type} (${a.value})`)
  .join('\n')}

Please provide recommendations in this JSON format:
[
  {"category": "transportation", "recommendation": "specific action", "potentialSavings": 50},
  ...
]
`;
  }

  /**
   * Parse AI response
   */
  private parseAIResponse(response: Record<string, unknown>): Recommendation[] {
    try {
      const content = (response.choices?.[0]?.message?.content as string) || '';
      const jsonMatch = content.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    return [];
  }

  /**
   * Fallback recommendations when AI is unavailable
   */
  private getFallbackRecommendations(emissions: Record<string, number>): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (emissions.transportation > 100) {
      recommendations.push({
        category: 'transportation',
        recommendation:
          'Consider carpooling 2-3 times per week to reduce vehicle emissions by 50%. Alternatively, explore public transit or cycling for short trips.',
        potentialSavings: Math.round(emissions.transportation * 0.5),
      });
    }

    if (emissions.energy > 50) {
      recommendations.push({
        category: 'energy',
        recommendation:
          'Switch to renewable energy or install solar panels. If not possible, use LED bulbs and improve insulation to reduce consumption by 30-40%.',
        potentialSavings: Math.round(emissions.energy * 0.35),
      });
    }

    if (emissions.diet > 30) {
      recommendations.push({
        category: 'diet',
        recommendation:
          'Reduce meat consumption to 2-3 times per week. Plant-based meals can cut dietary emissions by 50%. Try Meatless Mondays!',
        potentialSavings: Math.round(emissions.diet * 0.5),
      });
    }

    if (emissions.shopping > 20) {
      recommendations.push({
        category: 'shopping',
        recommendation:
          'Buy secondhand items when possible and avoid fast fashion. Choose quality over quantity to reduce overall consumption by 30%.',
        potentialSavings: Math.round(emissions.shopping * 0.3),
      });
    }

    return recommendations.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }
}

export const aiInsightsService = new AIInsightsService();
