import type { PageServerLoad } from './$types';
import { fetchArticles } from '$lib/news';

export const load: PageServerLoad = async () => {
  // Fetch initial articles server-side (category: all)
  // GNEWS_API_KEY lives in private env (no VITE_ prefix = server only)
  const apiKey = process.env.GNEWS_API_KEY ?? process.env.VITE_GNEWS_API_KEY;

  const initialArticles = await fetchArticles('all', apiKey);

  return { initialArticles };
};
