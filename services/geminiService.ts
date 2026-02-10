import { GoogleGenAI } from "@google/genai";
import { Flashcard } from "../types";

// Initialize the client
// NOTE: In a real production app, this key should be handled via backend proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Generates a response for the student AI assistant.
 */
export const generateAIResponse = async (
  prompt: string, 
  context: string = "Você é um assistente educacional gentil, inclusivo e especialista."
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: `${context} Responda de forma clara, curta e motivadora. Use emojis ocasionalmente.`,
        temperature: 0.7,
      },
    });
    return response.text || "Desculpe, não consegui processar sua resposta no momento.";
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return "Ocorreu um erro ao conectar com a IA. Tente novamente.";
  }
};

/**
 * Helper for teachers to generate content (questions, summaries).
 */
export const generateTeacherResource = async (
  topic: string,
  type: 'quiz' | 'summary' | 'lesson_plan'
): Promise<string> => {
  try {
    let systemInstruction = "";
    if (type === 'quiz') systemInstruction = "Gere 3 questões de múltipla escolha sobre o tema. Formato JSON.";
    if (type === 'summary') systemInstruction = "Gere um resumo didático e estruturado sobre o tema para alunos do ensino médio.";
    if (type === 'lesson_plan') systemInstruction = "Crie um plano de aula de 50 minutos sobre o tema, incluindo objetivos e atividades.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Gere um conteúdo do tipo ${type} sobre o tema: ${topic}`,
      config: {
        systemInstruction,
        temperature: 0.5,
      }
    });
    return response.text || "Erro ao gerar recurso.";
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return "Erro ao gerar recurso. Verifique sua conexão.";
  }
};

export const generateStudentReport = async (studentName: string, difficulty: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Gere um relatório pedagógico curto e construtivo para o aluno ${studentName} que tem dificuldade em: ${difficulty}. Sugira 2 ações práticas.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "Relatório indisponível.";
  } catch (error) {
    return "Erro ao gerar relatório.";
  }
};

export const generateStudyFlashcards = async (topic: string): Promise<Flashcard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Crie 4 flashcards de estudo sobre o tema: "${topic}".
      Retorne APENAS um texto cru (sem markdown de código) onde cada linha seja um card no formato: "Pergunta | Resposta".
      Exemplo:
      O que é Mitocôndria? | Organela responsável pela respiração celular.
      Fórmula da água? | H2O`,
      config: {
        temperature: 0.4,
      }
    });
    
    const text = response.text || "";
    const lines = text.split('\n').filter(line => line.includes('|'));
    
    return lines.map((line, index) => {
        const [front, back] = line.split('|');
        return {
            id: index.toString(),
            front: front.trim(),
            back: back ? back.trim() : "Resposta indisponível"
        };
    });
  } catch (error) {
    console.error("Erro ao gerar flashcards", error);
    return [];
  }
};