export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  rawMarkdown?: string;
  category: string;
  tags: string[];
  date: string;
  banner?: string;
  related?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  author?: string;
}

export interface ArticleMetadata {
  id: string;
  title: string;
  path: string;
  category: string;
  tags: string[];
  date: string;
  banner?: string;
  related?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Category {
  name: string;
  icon: string;
  color: string;
  articles: string[];
}

export interface ArticleIndex {
  articles: ArticleMetadata[];
  categories: Record<string, Category>;
}

export interface Tag {
  name: string;
  count: number;
  color?: string;
}
