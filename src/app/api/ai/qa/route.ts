import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai'; // Using OpenAI provider

// Note: In a real application, the API key would be set in environment variables.
// For this PoC, we assume it's configured globally for the Vercel AI SDK.
// process.env.OPENAI_API_KEY = 'your_openai_api_key_here'; // Simulated

export async function POST(request: NextRequest) {
  try {
    const { prompt: userPrompt } = await request.json();

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json({ message: 'Prompt is required and must be a string.' }, { status: 400 });
    }

    const systemPrompt = "You are a helpful assistant for a doors and windows website. Answer the user's questions concisely based on general knowledge about doors and windows. If the question is unrelated to doors, windows, or home improvement, politely state that you can only answer questions on these topics.";

    // Initialize the OpenAI chat model
    // Replace 'gpt-3.5-turbo' with your preferred model if needed
    const model = openai.chat('gpt-3.5-turbo'); 

    const { text: aiResponse, finishReason, usage } = await generateText({
      model: model,
      system: systemPrompt,
      prompt: userPrompt,
      // You can add more parameters here if needed, e.g., maxTokens, temperature
    });

    console.log('AI Response generated:', { aiResponse, finishReason, usage });

    return NextResponse.json({ response: aiResponse }, { status: 200 });

  } catch (error) {
    console.error('Error generating AI response:', error);
    let errorMessage = 'Failed to generate AI response.';
    if (error instanceof Error) {
        // Check for specific AI SDK errors if available, or just use the message
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
