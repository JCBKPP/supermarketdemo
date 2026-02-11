
import { GoogleGenAI } from "@google/genai";

// Use process.env.API_KEY directly in the service calls as per guidelines.

export const generateMarketingCopy = async (productName: string, tone: string) => {
  // Always initialize GoogleGenAI inside the function with the environment variable directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, engaging ${tone} social media marketing post for a supermarket product: ${productName}. Include emojis and hashtags.`,
      // Removed maxOutputTokens to prevent potential response blocking without thinkingBudget.
    });
    // Use .text property to access the generated content.
    return response.text;
  } catch (error) {
    console.error("AI Copy generation failed", error);
    return "Error generating content. Please try again.";
  }
};

export const generatePromotionalImage = async (prompt: string) => {
  // Always initialize GoogleGenAI inside the function with the environment variable directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A high-quality commercial promotional photography of ${prompt} for a supermarket advertisement, bright studio lighting, vibrant colors.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Iterate through response parts to find the inline image data as per guidelines.
    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("AI Image generation failed", error);
    return null;
  }
};
