import type { Article, Category } from './types';

// GNews API — free tier: 100 req/day
// Sign up at https://gnews.io/ for a free key
const GNEWS_BASE = 'https://gnews.io/api/v4';

const CATEGORY_MAP: Record<Exclude<Category, 'all' | 'legal'>, string> = {
  technology: 'technology',
  business:   'business',
  science:    'science',
  health:     'health',
};

// Mock data used when no API key is provided (demo mode)
function getMockArticles(category: Category): Article[] {
  const base: Omit<Article, 'id' | 'category'>[] = [
    {
      title: 'OpenAI Unveils New Reasoning Model with Enhanced Capabilities',
      description: 'The latest model demonstrates significant improvements in mathematical reasoning and code generation, setting new benchmarks across industry evaluations.',
      content: 'OpenAI has announced its newest AI model that reportedly surpasses previous benchmarks in reasoning tasks. The model uses a novel chain-of-thought approach that allows it to break down complex problems into manageable steps before arriving at an answer.',
      url: 'https://example.com/openai-model',
      image: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      source: { name: 'TechCrunch', url: 'https://techcrunch.com' },
    },
    {
      title: 'Federal Reserve Holds Rates Steady Amid Economic Uncertainty',
      description: 'The Fed signalled it needs more evidence of cooling inflation before considering rate cuts, with most officials projecting fewer reductions this year.',
      content: 'The Federal Reserve held interest rates steady at its latest meeting, with Chair Powell noting that the central bank needs to see sustained progress toward its 2% inflation target before making any adjustments to monetary policy.',
      url: 'https://example.com/fed-rates',
      image: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      source: { name: 'Reuters', url: 'https://reuters.com' },
    },
    {
      title: 'New Study Links Ultra-Processed Foods to Cognitive Decline',
      description: 'Researchers found that diets high in ultra-processed foods were associated with faster rates of cognitive deterioration in adults over 60.',
      content: 'A landmark study published in JAMA Neurology has found a significant correlation between consumption of ultra-processed foods and cognitive decline in older adults. The study followed 10,000 participants over a decade.',
      url: 'https://example.com/health-study',
      image: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      source: { name: 'Nature', url: 'https://nature.com' },
    },
    {
      title: 'EU Passes Landmark AI Liability Directive',
      description: 'The new directive holds AI developers and deployers accountable for harm caused by AI systems, representing a major shift in legal responsibility across Europe.',
      content: 'The European Union has passed a new AI Liability Directive that makes it easier for victims of AI-related harm to seek compensation. Companies deploying high-risk AI systems must now maintain detailed logs and documentation.',
      url: 'https://example.com/eu-ai-law',
      image: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      source: { name: 'Politico', url: 'https://politico.eu' },
    },
    {
      title: 'NASA Mars Mission Discovers Evidence of Ancient Water Channels',
      description: 'The Perseverance rover has identified geological formations consistent with ancient river systems, strengthening the case for past habitability.',
      content: 'NASA scientists have announced that the Perseverance rover has discovered compelling geological evidence of ancient water channels on Mars. The formations suggest liquid water flowed through the region approximately 3.5 billion years ago.',
      url: 'https://example.com/nasa-mars',
      image: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      source: { name: 'NASA', url: 'https://nasa.gov' },
    },
    {
      title: 'SvelteKit 3.0 Released with Major Performance Improvements',
      description: 'The latest version of SvelteKit introduces a new compiler pipeline that reduces bundle sizes by up to 40% and significantly improves hydration speed.',
      content: 'The Svelte team has released SvelteKit 3.0, featuring a completely rewritten compiler pipeline. Benchmarks show up to 40% smaller bundles and 2x faster hydration compared to the previous version.',
      url: 'https://example.com/sveltekit-3',
      image: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      source: { name: 'Vercel Blog', url: 'https://vercel.com/blog' },
    },
  ];

  return base.map((a, i) => ({
    ...a,
    id: `mock-${i}`,
    category: (['technology', 'business', 'health', 'legal', 'science', 'technology'] as Category[])[i],
  })).filter(a => category === 'all' || a.category === category);
}

export async function fetchArticles(
  category: Category,
  apiKey: string | undefined
): Promise<Article[]> {
  // Demo mode — no API key
  if (!apiKey || apiKey === 'your_gnews_api_key_here') {
    return getMockArticles(category);
  }

  try {
    const topic = category === 'all' || category === 'legal'
      ? 'breaking-news'
      : CATEGORY_MAP[category as keyof typeof CATEGORY_MAP];

    const url = `${GNEWS_BASE}/top-headlines?topic=${topic}&lang=en&max=9&apikey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GNews error ${res.status}`);
    const data = await res.json();

    return (data.articles || []).map((a: any, i: number): Article => ({
      id:          `${category}-${i}-${Date.now()}`,
      title:       a.title,
      description: a.description || '',
      content:     a.content || a.description || '',
      url:         a.url,
      image:       a.image || null,
      publishedAt: a.publishedAt,
      source:      { name: a.source?.name || 'Unknown', url: a.source?.url || '#' },
      category,
    }));
  } catch {
    // Fallback to mock data on any error
    return getMockArticles(category);
  }
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return 'just now';
}
