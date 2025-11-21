import { GoogleGenAI } from "@google/genai";
import { PlayerCardData, GroundingSource } from "../types";

// Safely retrieve API key to prevent runtime crashes in non-Node environments if process is not defined
const apiKey = (typeof process !== "undefined" && process.env) ? process.env.API_KEY : "";
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generatePlayerCard = async (playerName: string): Promise<PlayerCardData> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the REACT_APP_GEMINI_API_KEY environment variable.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a world-class football scout and historian. Generate a comprehensive Ultimate Team style profile for: ${playerName}.

      CRITICAL INSTRUCTIONS FOR IMAGE:
      1. **SEARCH**: Use Google Search to find a visual representation of this player.
      2. **PRIORITY**: Look for **Wikimedia Commons** images. 
      3. **EXTRACTION**: If you find a Wikimedia "File:Name.jpg" page, you MUST extract the actual source URL (e.g., "https://upload.wikimedia.org/.../Name.jpg").
      4. **FALLBACK**: If no Wikimedia image, try to find a stable URL from a major sports news site (ESPN, Sky, etc.) ending in .jpg or .png.
      5. **VALIDATION**: The URL must be a direct link to an image file. If unsure, return empty string "".

      CRITICAL SOURCE INSTRUCTIONS FOR DATA:
      1. **History & Bio**: Use **Wikipedia** as the primary source for Youth Career, Transfer History (years, clubs, fees), and International Stats.
      2. **Stats**: Use **FBRef** and **Transfermarkt** for precise performance data (goals/90, assists, defensive actions) to inform attributes.
      3. **Ratings**: Use **SoFIFA** or **EA FC** databases for base rating calibration if available.

      DATA REQUIREMENTS:
      - **Transfer History**: List major senior career moves with Season, Club, and Fee (or "Free"/"Loan").
      - **International**: Provide Nation, Total Caps, Total Goals, and Active Years.
      - **Youth**: List youth academies attended.
      - **Attributes**: 1-99 scale. 
        - Pace (Sprint Speed, Acceleration)
        - Shooting (Finishing, Shot Power, etc.)
        - Passing (Vision, Crossing, etc.)
        - Dribbling (Agility, Balance, etc.)
        - Defending (Interceptions, Tackle)
        - Physical (Strength, Stamina)

      SPECIAL GOALKEEPER (GK) INSTRUCTIONS:
      - If the player is a Goalkeeper, set 'position' to 'GK'.
      - **Face Stats**: Diving (DIV), Handling (HAN), Kicking (KIC), Reflexes (REF), Speed (SPD), Positioning (POS).
      - **Attributes**: Fill 'gk...' attributes accurately. Set outfield attributes low (10-40) unless known for them (e.g. Ederson's passing).

      Return ONLY valid JSON wrapped in markdown code blocks \`\`\`json ... \`\`\`.
      
      JSON Structure:
      {
        "name": "Player Name",
        "club": "Club Name",
        "league": "League",
        "nation": "Nation",
        "position": "ST/CM/CB/GK/etc",
        "image": "URL string (https://upload.wikimedia.org/...)",
        "overallRating": Number,
        "faceStats": {
          "pac": Number, "sho": Number, "pas": Number, "dri": Number, "def": Number, "phy": Number,
          "div": Number, "han": Number, "kic": Number, "ref": Number, "spd": Number, "pos": Number
        },
        "attributes": {
          "acceleration": Number, "sprintSpeed": Number,
          "finishing": Number, "shotPower": Number, "longShot": Number, "volleys": Number, "penalties": Number, "positioning": Number,
          "vision": Number, "crossing": Number, "freeKick": Number, "shortPassing": Number, "longPassing": Number, "curve": Number,
          "agility": Number, "balance": Number, "reactions": Number, "ballControl": Number, "dribbling": Number, "composure": Number,
          "interceptions": Number, "heading": Number, "marking": Number, "standingTackle": Number, "slidingTackle": Number,
          "jumping": Number, "stamina": Number, "strength": Number, "aggression": Number,
          "gkDiving": Number, "gkHandling": Number, "gkKicking": Number, "gkPositioning": Number, "gkReflexes": Number
        },
        "description": "Detailed playstyle summary.",
        "transferHistory": [
          { "season": "YYYY-YYYY", "club": "Club Name", "fee": "Fee/Type" }
        ],
        "internationalHistory": {
          "nation": "Country",
          "caps": Number,
          "goals": Number,
          "years": "YYYY-Present or YYYY-YYYY"
        },
        "youthCareer": ["Academy A", "Academy B"]
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      },
    });

    // Extract Grounding Sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    // Extract and Parse JSON
    const text = response.text || "";
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (!jsonMatch) {
        try {
            const data = JSON.parse(text);
            return { ...data, sources };
        } catch (e) {
            console.error("Failed to parse raw text as JSON", text);
            throw new Error("AI response format error. Please try again.");
        }
    }

    const jsonString = jsonMatch[1];
    const data = JSON.parse(jsonString);

    return {
      ...data,
      sources
    };

  } catch (error) {
    console.error("Error fetching player data:", error);
    throw error;
  }
};
