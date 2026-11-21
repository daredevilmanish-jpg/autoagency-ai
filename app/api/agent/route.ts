import { NextResponse } from 'next/server';

type AgentRole = 'sales' | 'builder' | 'qa';
type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

const instructions: Record<AgentRole, string> = {
  sales: 'You are an ethical B2B sales assistant for a small Indian web design agency. Create a concise prospect assessment, an individually tailored outreach DRAFT, three discovery questions, and a suggested next step. Do not invent verified facts, contact details, consent, or prior interactions. Never claim a message was sent. Clearly distinguish assumptions.',
  builder: 'You are a website delivery project manager. Convert the client requirements into a concrete implementation brief with pages, sections, functionality, visual direction, acceptance criteria, milestones, and open questions. Do not claim to have built or deployed a website.',
  qa: 'You are a website QA planner. Based only on supplied project information, create a test checklist with priority, expected outcome and manual verification steps. Do not claim any tests passed without evidence.',
};

export async function POST(req: Request) {
  try {
    const { role, context } = await req.json();
    if (
      !['sales', 'builder', 'qa'].includes(role) ||
      typeof context !== 'string' ||
      !context.trim() ||
      context.length > 15000
    ) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini is not configured. Set GEMINI_API_KEY in Vercel environment variables.' },
        { status: 503 },
      );
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instructions[role as AgentRole] }] },
          contents: [{ role: 'user', parts: [{ text: context }] }],
          generationConfig: { maxOutputTokens: 2048 },
        }),
        signal: AbortSignal.timeout(30000),
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      // Log only the HTTP status; provider error bodies can contain sensitive details.
      console.error('Gemini API request failed', { status: response.status });
      const messages: Record<number, string> = {
        400: 'Gemini rejected the request (400). Check the selected model and request format.',
        401: 'Gemini authentication failed (401). Check the API key in Vercel.',
        403: 'Gemini access denied (403). Check API key restrictions and Gemini API access in Google AI Studio.',
        404: 'Gemini model not found (404). Check GEMINI_MODEL and whether the model is available to your API key.',
        429: 'Gemini quota or rate limit reached (429). Check Google AI Studio usage limits.',
      };
      return NextResponse.json(
        { error: messages[response.status] || `Gemini API returned HTTP ${response.status}. Check Google AI Studio for API availability and project access.` },
        { status: response.status === 429 ? 429 : 502 },
      );
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();

    if (!text) {
      return NextResponse.json(
        { error: 'Gemini returned no text. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Gemini request timed out. Please try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Agent request failed. Please try again.' }, { status: 500 });
  }
}
