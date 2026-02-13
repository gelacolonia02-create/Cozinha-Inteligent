
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getIngredientSubstitutions = async (ingredientName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Sugira 3 substitutos comuns para o ingrediente "${ingredientName}" em receitas culinárias. Formate como uma lista curta.`,
    config: {
      temperature: 0.7,
    }
  });
  return response.text;
};

export const getNutritionalQuickInfo = async (recipeTitle: string, ingredients: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analise brevemente o perfil nutricional da receita "${recipeTitle}" com os ingredientes: ${ingredients}. Destaque pontos positivos e calorias estimadas.`,
    config: {
      temperature: 0.5,
    }
  });
  return response.text;
};

export const suggestRecipesFromIngredients = async (ingredientsList: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Com base nestes ingredientes: ${ingredientsList.join(', ')}, sugira 2 receitas rápidas.`,
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
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Erro ao processar JSON da IA:", e);
    return [];
  }
};
