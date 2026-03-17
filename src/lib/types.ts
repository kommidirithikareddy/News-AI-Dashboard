export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  category: string;
}

export type Category = 'all' | 'technology' | 'business' | 'science' | 'health' | 'legal';

export interface SummaryState {
  [articleId: string]: {
    text: string;
    loading: boolean;
    error: string | null;
  };
}

export interface TrendsState {
  text: string;
  loading: boolean;
  error: string | null;
}
