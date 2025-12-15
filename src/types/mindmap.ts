export interface MindMapNode {
  id: string;
  label: string;
  category: string;
  position?: { x: number; y: number };
  data?: {
    articleId?: string;
    description?: string;
    color?: string;
  };
}

export interface MindMapEdge {
  id?: string;
  source: string;
  target: string;
  label?: string;
  type?: 'prerequisite' | 'related' | 'extends' | 'applies-to';
  animated?: boolean;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}
