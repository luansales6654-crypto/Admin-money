import { FinancialContext, generateDeterministicAssistantReply } from '../../server/ai';

export async function askFinancialAssistantClient(
  prompt: string,
  context: FinancialContext
): Promise<string> {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.reply || generateDeterministicAssistantReply(prompt, context);
  } catch (err) {
    console.warn('Using client-side deterministic financial responder:', err);
    return generateDeterministicAssistantReply(prompt, context);
  }
}
