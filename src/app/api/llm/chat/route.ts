import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are an expert at translating basketball statistics into biotech research analogies. 
Your role is to help researchers understand statistical concepts from sports analytics and map them to 
pharmaceutical and biotech research contexts.

Key mappings you should know:
- Field Goal % → Transfection Efficiency
- Three-Point % → Specificity Ratio
- Assists → Synergistic Drug Interactions
- Rebounds → Recapture Rate
- Turnovers → Adverse Events
- Plus/Minus → Therapeutic Index
- Points Per Game → Bioavailability

Always provide:
1. The biotech equivalent concept
2. A clear explanation of the analogy
3. How the statistical measure translates
4. Potential applications in research

When discussing NBA statistics, relate them to real biotech/clinical trial concepts. Be precise and scientific.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, stream = false } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Format messages for the API
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    if (stream) {
      // For streaming responses, we'll use a different approach
      // For now, we'll just return the full response
      const completion = await zai.chat.completions.create({
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = completion.choices[0]?.message?.content || '';
      
      return new Response(JSON.stringify({ 
        content,
        role: 'assistant',
        done: true 
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Non-streaming response
      const completion = await zai.chat.completions.create({
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = completion.choices[0]?.message?.content || '';

      return NextResponse.json({
        content,
        role: 'assistant',
        usage: completion.usage
      });
    }
  } catch (error: any) {
    console.error('LLM Chat Error:', error);
    
    // Handle specific errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service configuration error. Please check API settings.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// GET endpoint to check LLM status
export async function GET() {
  try {
    const zai = await ZAI.create();
    
    // Simple test to verify the SDK is working
    return NextResponse.json({
      status: 'available',
      service: 'z-ai-web-dev-sdk',
      message: 'LLM service is ready'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'LLM service unavailable'
    }, { status: 500 });
  }
}
