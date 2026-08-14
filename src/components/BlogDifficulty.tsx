import { Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogDifficultyLevel } from '@/data/blogPosts/types';

const difficultyLabels: Record<BlogDifficultyLevel, string> = {
  1: 'Easy',
  2: 'Introductory',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Research-level',
};

const levelColors = ['#2a9d8f', '#69a85d', '#d4a72c', '#df713f', '#c3454f'];

interface BlogDifficultyProps {
  level: BlogDifficultyLevel;
  className?: string;
}

const BlogDifficulty = ({ level, className }: BlogDifficultyProps) => {
  const label = difficultyLabels[level];

  return (
    <div
      className={cn('border-y border-border/80 py-3', className)}
      aria-label={`Difficulty: ${label}, ${level} out of 5`}
      title={`Difficulty: ${label} (${level}/5)`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
          <Gauge size={17} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>Technical difficulty</span>
        </div>
        <div className="flex shrink-0 items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="text-xs tabular-nums text-muted-foreground">{level}/5</span>
        </div>
      </div>

      <div className="mt-3" aria-hidden="true">
        <div className="relative grid h-2.5 grid-cols-5 gap-1">
          {levelColors.map((color, index) => (
            <span
              key={color}
              className="rounded-[2px] transition-all duration-300"
              style={{
                backgroundColor: color,
                opacity: index < level ? 1 : 0.18,
                transform: index === level - 1 ? 'scaleY(1.45)' : undefined,
                boxShadow:
                  index === level - 1
                    ? `0 0 0 2px hsl(var(--background)), 0 0 0 3px ${color}`
                    : undefined,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>Easy</span>
          <span>Hard</span>
        </div>
      </div>
    </div>
  );
};

export default BlogDifficulty;
