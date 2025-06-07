import { NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const systemPrompt = `You are a helpful AI assistant that generates responsive, modern landing pages based on user input.
When generating a landing page, follow these guidelines:
1. Use modern HTML5 and CSS3 features
2. Make the page fully responsive
3. Use a clean, professional design
4. Include proper meta tags and viewport settings
5. Use semantic HTML elements
6. Add smooth animations and transitions
7. Ensure accessibility
8. Instead of images, use placeholder shapes with color and text

IMPORTANT: Format your response as a JSON object with the following structure:
{
  "message": "Your explanation of the landing page design",
  "hasCode": true,
  "code": "<!DOCTYPE html>..."
}

{
  "message": "Your explanation of the landing page design",
  "hasCode": false,
  "code": null
}

Example response:
{
  "message": "Here's a modern landing page with a hero section, features, and contact form.",
  "hasCode": true,
  "code": "<!DOCTYPE html>..."
}`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const userMessage = messages[messages.length - 1].content

    const model = "gemini-2.5-flash-preview-05-20"
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}\n\nUser request: ${userMessage}`,
          },
        ],
      },
    ]

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            hasCode: { type: Type.BOOLEAN },
            code: { type: Type.STRING },
          },
          required: ["message", "hasCode", "code"],
          propertyOrdering: ["message", "hasCode", "code"],
        },
      },
    });

    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("No response from Gemini API")
    }

    const rawTextFromGemini = response.candidates[0].content.parts[0].text
    // console.log("Raw API response text from Gemini:", rawTextFromGemini)

    let parsedResponse
    try {
      const cleanedJsonString = rawTextFromGemini.replace(/^```json\s*|\s*```$/g, '')
      console.log("Cleaned JSON string for parsing:", cleanedJsonString)

      parsedResponse = JSON.parse(cleanedJsonString)

      return NextResponse.json(parsedResponse)
    } catch (parseError) {
      console.error("Error parsing cleaned JSON response from model:", parseError)
      return NextResponse.json({
        message: `Failed to parse model's JSON output even after cleaning. Raw (unparsed) response: ${rawTextFromGemini}`,
        hasCode: false,
        code: null,
      })
    }
  } catch (apiError) {
    console.error("Error in chat API call:", apiError)
    return NextResponse.json(
      { error: "Failed to generate response due to internal server error." },
      { status: 500 }
    )
  }
} 