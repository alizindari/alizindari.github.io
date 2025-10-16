import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  children: string;
  display?: boolean;
}

const MathRenderer = ({ children, display = false }: MathRendererProps) => {
  if (display) {
    return (
      <div className="math-display my-4 text-center">
        <BlockMath math={children} />
      </div>
    );
  }

  return (
    <span className="math-inline">
      <InlineMath math={children} />
    </span>
  );
};

export default MathRenderer;