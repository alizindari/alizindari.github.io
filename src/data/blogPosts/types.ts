export type BlogDifficultyLevel = 1 | 2 | 3 | 4 | 5;

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
  difficulty: BlogDifficultyLevel;
  content: string;
}
