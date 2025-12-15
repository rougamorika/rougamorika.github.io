import { useState, useEffect } from 'react';
import type { MindMapData } from '@types/mindmap';

/**
 * Hook to load and manage mind map data
 */
export function useMindMap() {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMindMap = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/src/content/metadata/relationships.json');
        if (!response.ok) {
          throw new Error('Failed to load mind map data');
        }

        const data: MindMapData = await response.json();
        setMindMapData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error loading mind map:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMindMap();
  }, []);

  return { mindMapData, isLoading, error };
}
