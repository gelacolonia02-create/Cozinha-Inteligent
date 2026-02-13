
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getIngredientSubstitutions = async (ingredientName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Você é um chef experiente. Sugira 3 substitutos comuns para o ingrediente "${ingredientName}" em receitas culinárias. Justifique brevemente cada um.`,
  });
  return response.text;
};

export const getNutritionalQuickInfo = async (recipeTitle: string, ingredients: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Você é um nutricionista. Analise o perfil nutricional da receita "${recipeTitle}" com estes ingredientes: ${ingredients}. Destaque benefícios e forneça uma estimativa de calorias por porção. Seja conciso.`,
  });
  return response.text;
};

export const suggestRecipesFromIngredients = async (ingredientsList: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Com base nestes ingredientes disponíveis: ${ingredientsList.join(', ')}. Sugira exatamente 2 receitas criativas que podem ser feitas.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            time: { type: Type.STRING }
          },
          required: ["title", "description", "time"]
        }
      }
    }
  });
  
  try {
    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (e) {
    console.error("Erro ao processar JSON da IA:", e);
    return [];
  }
};
