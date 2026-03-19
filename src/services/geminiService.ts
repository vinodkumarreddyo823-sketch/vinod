import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SignalAnalysis {
  noiseLevel: string;
  dominantFrequencies: string[];
  patterns: string[];
  summary: string;
  recommendations: string[];
}

export async function analyzeSignal(signalData: number[], sampleRate: number): Promise<SignalAnalysis> {
  // We'll send a subset of data if it's too large, or a summary
  const dataSummary = signalData.slice(0, 500).join(", ");
  
  const prompt = `
    Analyze the following signal data (first 500 samples):
    Sample Rate: ${sampleRate} Hz
    Data: [${dataSummary}]
    
    Provide a technical analysis including:
    1. Estimated noise level (Low, Medium, High) with reasoning.
    2. Dominant frequencies or periodicities observed.
    3. Any specific patterns (e.g., sinusoidal, square, spikes, trends).
    4. A concise summary of the signal's characteristics.
    5. Technical recommendations for filtering or processing.
    
    Return the response in valid JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          noiseLevel: { type: "STRING" },
          dominantFrequencies: { type: "ARRAY", items: { type: "STRING" } },
          patterns: { type: "ARRAY", items: { type: "STRING" } },
          summary: { type: "STRING" },
          recommendations: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["noiseLevel", "dominantFrequencies", "patterns", "summary", "recommendations"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as SignalAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Analysis failed to produce valid results.");
  }
}
