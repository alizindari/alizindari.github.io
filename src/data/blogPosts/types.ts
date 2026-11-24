export type BlogDifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface BlogFigure {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  maxWidth?: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  math: string;
  tags: string[];
  difficulty: BlogDifficultyLevel | null;
  language?: 'en' | 'fa';
  feedbackIntro?: string;
  theme?: 'attention-slides';
  figures?: Record<string, BlogFigure>;
  references?: { title: string; description?: string; url: string }[];
  content: string;
}
