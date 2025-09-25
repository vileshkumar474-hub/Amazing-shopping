'use server';

import { customerSupportChatbot } from '@/ai/flows/customer-support-chatbot';

export async function handleChat(query: string) {
  try {
    const result = await customerSupportChatbot({ query });
    return result.response;
  } catch (error) {
    console.error('Error handling chat:', error);
    return "I'm sorry, but I'm having trouble connecting right now. Please try again later.";
  }
}
