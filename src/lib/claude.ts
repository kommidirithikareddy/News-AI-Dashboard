// Client-side Claude API calls for summaries
// API key is stored in VITE_ env var (browser-safe for portfolio use)
// For production, move to +server.ts endpoints

export async function summariseArticle(title: string, content: string): Promise<string> {
  const key = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!key) throw new Error('Missing VITE_CLAUDE_API_KEY');
  

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Summarise this news article in 3-4 clear sentences. Be concise and factual.\n\nTitle: ${title}\n\nContent: ${content.slice(0, 2000)}`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content[0].text as string;
}

export async function analyseTrends(articleTitles: string[]): Promise<string> {
  const key = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!key) throw new Error('Missing VITE_CLAUDE_API_KEY');
 
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `Based on these news headlines, identify 3-4 key trends or themes. Be concise and insightful.\n\nHeadlines:\n${articleTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content[0].text as string;
}
