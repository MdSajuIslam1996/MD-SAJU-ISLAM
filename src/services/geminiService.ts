
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { SocialPlatform, ResearchSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const platformInstructions = {
  Facebook: 'একটি বন্ধুত্বপূর্ণ এবং আকর্ষণীয় ফেসবুক পোস্ট তৈরি করুন। ইমোজি ব্যবহার করুন।',
  Instagram: 'একটি সংক্ষিপ্ত এবং আকর্ষণীয় ইনস্টাগ্রাম ক্যাপশন তৈরি করুন। প্রাসঙ্গিক হ্যাশট্যাগ অন্তর্ভুক্ত করুন।',
  LinkedIn: 'একটি পেশাদার এবং তথ্যবহুল লিঙ্কডইন পোস্ট তৈরি করুন। কোনো ইমোজি ব্যবহার করবেন না এবং একটি আনুষ্ঠানিক সুর বজায় রাখুন।',
  TikTok: 'একটি ট্রেন্ডি TikTok ভিডিওর জন্য একটি সংক্ষিপ্ত, আকর্ষণীয় স্ক্রিপ্ট বা ক্যাপশন তৈরি করুন। জনপ্রিয় হ্যাশট্যাগ অন্তর্ভুক্ত করুন।',
};

const getBaseSystemInstruction = (language: 'Bangla' | 'English') => {
  return `You are an expert social media manager. Based on the user's prompt, create tailored content for each requested social media platform in the specified language (${language}). Follow these specific instructions for each platform if the language is Bangla: \n- Facebook: ${platformInstructions.Facebook}\n- Instagram: ${platformInstructions.Instagram}\n- LinkedIn: ${platformInstructions.LinkedIn}\n- TikTok: ${platformInstructions.TikTok}. Ensure the output is a valid JSON object matching the provided schema. The image prompt must always be in English. For English posts, maintain a professional but engaging tone suitable for each platform.`;
};

export const generatePostContent = async (prompt: string, platforms: SocialPlatform[], language: 'Bangla' | 'English'): Promise<{ platform: SocialPlatform; content: string; imagePrompt: string; }[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User prompt: "${prompt}". Generate social media posts in ${language} for the following platforms: ${platforms.join(', ')}. For each post, also create a short, descriptive, visually rich prompt in English for an AI image generator based on the post's content.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT, properties: { posts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, content: { type: Type.STRING }, imagePrompt: { type: Type.STRING } }, required: ['platform', 'content', 'imagePrompt'] } } } },
        systemInstruction: getBaseSystemInstruction(language),
      },
    });
    // FIX: Access the text content via the `text` property.
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse?.posts || [];
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("AI কন্টেন্ট তৈরি করতে ব্যর্থ হয়েছে।");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: "1:1" } }
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        throw new Error("AI থেকে কোনো ছবি পাওয়া যায়নি।");
    } catch(error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("AI ছবি তৈরি করতে ব্যর্থ হয়েছে।");
    }
}

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ inlineData: { data: base64ImageData, mimeType: mimeType } }, { text: `Edit instruction: "${prompt}"` }] },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        throw new Error("AI থেকে কোনো সম্পাদিত ছবি পাওয়া যায়নি।");
    } catch (error) {
        console.error("Error editing image with Gemini:", error);
        throw new Error("AI ছবি সম্পাদনা করতে ব্যর্থ হয়েছে।");
    }
};

export const generateMessageReply = async (message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate a polite and helpful reply in Bangla to this message: "${message}"`,
            config: { systemInstruction: "You are a helpful assistant managing social media messages." }
        });
        // FIX: Access the text content via the `text` property.
        return response.text;
    } catch(error) {
        console.error("Error generating reply with Gemini:", error);
        throw new Error("AI উত্তর তৈরি করতে ব্যর্থ হয়েছে।");
    }
};

export const createChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: 'You are a helpful AI assistant. Provide concise answers in clear Markdown format (Bangla).',
            tools: [{googleSearch: {}}],
        },
    });
};

export const generateIdeas = async (topic: string, ideaType: 'ideas' | 'hashtags'): Promise<string> => {
  const userPrompt = ideaType === 'ideas' 
    ? `Topic: "${topic}". Generate 5 creative social media post ideas in Bangla.`
    : `Topic: "${topic}". Generate 15 relevant hashtags in Bangla.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: { systemInstruction: 'You are a creative social media strategist. Use Markdown.' },
    });
    // FIX: Access the text content via the `text` property.
    return response.text;
  } catch (error) {
    console.error(`Error generating ${ideaType} with Gemini:`, error);
    throw new Error("AI আইডিয়া তৈরি করতে ব্যর্থ হয়েছে।");
  }
};
