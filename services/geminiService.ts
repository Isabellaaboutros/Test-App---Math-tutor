
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const imageToGenerativePart = (imageData: string, mimeType: string) => {
  return {
    inlineData: {
      data: imageData.split(',')[1],
      mimeType,
    },
  };
};

const formatChatHistoryForPrompt = (chatHistory: Message[]) => {
  return chatHistory
    .map(msg => `${msg.sender === 'user' ? 'Student' : 'Tutor'}: ${msg.text}`)
    .join('\n');
};

export const getFirstStep = async (imageData: string, mimeType: string) => {
  const ai = getAI();
  const imagePart = imageToGenerativePart(imageData, mimeType);
  const textPart = {
    text: "You are a compassionate, Socratic math tutor. A student has uploaded this image of a math problem. Do not solve the entire problem. Your goal is to guide them. Analyze the problem and provide only the very first step to begin solving it. Explain the step clearly but concisely. Frame your response as a friendly guide."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [textPart, imagePart] },
  });
  return response.text;
};

export const getNextStep = async (chatHistory: Message[]) => {
  const ai = getAI();
  const formattedHistory = formatChatHistoryForPrompt(chatHistory);
  const prompt = `You are a compassionate, Socratic math tutor. Continue the conversation below. The student wants the next step. Provide only the next single step to solve the problem. Keep your explanation brief. Do not solve the rest of the problem, just provide the immediate next step.

Conversation History:
${formattedHistory}

Tutor:`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text;
};

export const explainStep = async (chatHistory: Message[]) => {
  const ai = getAI();
  const formattedHistory = formatChatHistoryForPrompt(chatHistory);
  const prompt = `You are an expert math teacher with a talent for explaining complex concepts simply. A student is asking for the reasoning behind a specific step in solving a math problem. Based on the conversation history, provide a clear, patient, and detailed explanation for *why* the last step provided by the tutor was taken. Focus on the underlying mathematical concept or rule. Do not provide the next step.

Conversation History:
${formattedHistory}

Tutor's Explanation:`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};
