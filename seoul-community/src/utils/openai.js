// src/utils/openai.js
export async function createChatCompletion(messages, opts = {}) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) throw new Error('VITE_OPENAI_API_KEY not set');

  const { model = 'gpt-5-mini', temperature, ...rest } = opts;

  // max_tokens 호환 처리
  if (rest.max_tokens != null && rest.max_completion_tokens == null) {
    rest.max_completion_tokens = rest.max_tokens;
    delete rest.max_tokens;
  }

  // temperature는 명시적으로 전달된 경우에만 body에 포함
  const body = { model, messages, ...rest };
  if (temperature !== undefined) body.temperature = temperature;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }
  return res.json();
}