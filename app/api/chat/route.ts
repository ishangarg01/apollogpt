import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, StreamingTextResponse, Message as VercelAIMessage } from 'ai'

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

// Maximum duration for streaming responses (30 seconds)
const maxDuration = 30

const SYSTEM_PROMPT = `You are a helpful AI assistant that generates responsive, modern landing pages based on user input.
When generating a landing page, follow these guidelines:
1. Use modern HTML5 and CSS3 features
2. Make the page fully responsive
3. Use a clean, professional design
4. Include proper meta tags and viewport settings
5. Use semantic HTML elements
6. Add smooth animations and transitions
7. Ensure accessibility
8. Instead of images, use placeholder shapes with color and text

IMPORTANT: You must always format your response as a JSON object with the following structure, even for conversational replies:
{
  "parts": [
    {
      "type": "text",
      "text": "Your message here"
    },
    {
      "type": "code",
      "language": "html",
      "code": "Your HTML code here"
    }
  ]
}

If you need to ask a clarifying question, provide it in the "text" field of a "text" part. Do not include a "code" part in that case.`

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages }: { messages: VercelAIMessage[] } = await req.json()
    const lastUserMessage = messages[messages.length - 1]
    
    const chatHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'I understand. I will always respond with a JSON object following the specified structure.' }] },
        ...chatHistory
      ],
    })

    const streamResult = await chat.sendMessageStream(lastUserMessage.content)
    
    const stream = GoogleGenerativeAIStream(streamResult)
    return new StreamingTextResponse(stream)

  } catch (error) {
    console.error('Error in chat route:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
} 