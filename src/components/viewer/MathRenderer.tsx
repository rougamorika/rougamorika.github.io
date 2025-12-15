import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Component to render LaTeX math using KaTeX
 */
export function MathRenderer({ math, displayMode = false, className = '' }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode,
          throwOnError: false,
          errorColor: '#ff6b9d',
          strict: false,
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = `Error rendering math: ${math}`;
        }
      }
    }
  }, [math, displayMode]);

  return (
    <span
      ref={containerRef}
      className={`math-renderer ${displayMode ? 'math-display' : 'math-inline'} ${className}`}
    />
  );
}

/**
 * Inline math component
 */
export function InlineMath({ math, className }: { math: string; className?: string }) {
  return <MathRenderer math={math} displayMode={false} className={className} />;
}

/**
 * Display (block) math component
 */
export function DisplayMath({ math, className }: { math: string; className?: string }) {
  return <MathRenderer math={math} displayMode={true} className={className} />;
}
