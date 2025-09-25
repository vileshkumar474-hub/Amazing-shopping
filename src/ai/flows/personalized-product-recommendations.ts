// src/ai/flows/personalized-product-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized product recommendations to users based on their browsing history and past purchases.
 *
 * - `getPersonalizedRecommendations` -  A function that takes a user ID and returns a list of product recommendations.
 * - `PersonalizedRecommendationsInput` - The input type for the `getPersonalizedRecommendations` function, which includes the user ID.
 * - `PersonalizedRecommendationsOutput` - The output type for the `getPersonalizedRecommendations` function, which is a list of product IDs.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate recommendations for.'),
  browsingHistory: z.array(z.string()).optional().describe('List of product IDs representing the user\'s browsing history.'),
  pastPurchases: z.array(z.string()).optional().describe('List of product IDs representing the user\'s past purchases.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  productIds: z.array(z.string()).describe('A list of product IDs recommended for the user.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert recommendation system designed to provide personalized product recommendations to users of an e-commerce platform.

  Based on the user's browsing history and past purchases, identify products that the user might be interested in.

  Return a list of product IDs.

  User ID: {{{userId}}}
  {{#if browsingHistory}}
  Browsing History: {{#each browsingHistory}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/if}}
  {{#if pastPurchases}}
  Past Purchases: {{#each pastPurchases}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{/if}}
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
