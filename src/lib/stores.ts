import { writable, derived } from 'svelte/store';
import type { Article, Category, SummaryState, TrendsState } from './types';

export const articles     = writable<Article[]>([]);
export const activeCategory = writable<Category>('all');
export const searchQuery  = writable('');
export const summaries    = writable<SummaryState>({});
export const trends       = writable<TrendsState>({ text: '', loading: false, error: null });

// Derived: filtered articles based on category + search
export const filteredArticles = derived(
  [articles, activeCategory, searchQuery],
  ([$articles, $cat, $q]) => {
    let list = $articles;
    if ($cat !== 'all') {
      list = list.filter(a => a.category === $cat);
    }
    if ($q.trim()) {
      const lower = $q.toLowerCase();
      list = list.filter(
        a =>
          a.title.toLowerCase().includes(lower) ||
          a.description.toLowerCase().includes(lower)
      );
    }
    return list;
  }
);
