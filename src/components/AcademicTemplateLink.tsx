import { ArrowUpRight, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademicTemplateLinkProps {
  className?: string;
}

const AcademicTemplateLink = ({ className }: AcademicTemplateLinkProps) => (
  <a
    href="https://github.com/alizindari/academic-slide-poster-template"
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      'group inline-flex items-center gap-2 border-b border-primary/25 pb-1 text-sm font-medium text-primary transition-colors hover:border-primary hover:text-primary-light sm:text-base',
      className,
    )}
  >
    <Github size={17} strokeWidth={1.9} aria-hidden="true" />
    <span>Poster &amp; slide templates</span>
    <span className="text-muted-foreground transition-colors group-hover:text-primary">on GitHub</span>
    <ArrowUpRight
      size={15}
      strokeWidth={1.9}
      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  </a>
);

export default AcademicTemplateLink;
