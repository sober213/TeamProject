// src/utils/prompt.js
export function buildMessages(query, relevantItems = []) {
  const system = `You are an assistant that answers questions about Seoul using ONLY the provided JSON items.
Be concise, provide structured info (name, location, date/time when applicable), and don't hallucinate beyond the provided items.
If the answer requires outside knowledge, say: "I only know the provided dataset."`;

  const contextText = relevantItems.length
    ? 'Relevant data items:\n' + relevantItems.map((it, i) => `${i+1}. title: ${it.title || ''}; place: ${it.eventplace || ''}; date: ${it.eventstartdate || ''}; summary: ${it.svccn || it.eventenddate || ''}`).join('\n')
    : 'No relevant items found in dataset.';

  const user = `User query: "${query}"\n\nUse the Relevant data to answer the query. If multiple items match, list up to 3 recommendations with brief notes. ${contextText}`;

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}