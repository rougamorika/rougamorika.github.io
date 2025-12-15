import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMindMap } from '@hooks/useMindMap';
import { useArticleStore } from '@store/articleStore';

export function MindMap() {
  const { mindMapData, isLoading } = useMindMap();
  const { setCurrentArticle, setLoading } = useArticleStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert mind map data to React Flow format
  useEffect(() => {
    if (mindMapData) {
      // Convert nodes
      const flowNodes: Node[] = mindMapData.nodes.map((node) => ({
        id: node.id,
        type: 'default',
        position: node.position || { x: 0, y: 0 },
        data: {
          label: (
            <div className="px-4 py-2 text-center">
              <div className="font-semibold text-white">{node.label}</div>
              {node.data?.description && (
                <div className="text-xs text-white/80 mt-1">
                  {node.data.description}
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: node.data?.color || '#FF6B9D',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: 0,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }));

      // Convert edges
      const flowEdges: Edge[] = mindMapData.edges.map((edge) => ({
        id: edge.id || `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: edge.type === 'prerequisite' ? 'smoothstep' : 'default',
        animated: edge.animated || edge.type === 'prerequisite',
        style: {
          stroke: '#C6A7FF',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#C6A7FF',
        },
        labelStyle: {
          fill: '#666',
          fontSize: 12,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: 'white',
          fillOpacity: 0.9,
        },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [mindMapData, setNodes, setEdges]);

  // Handle node click - navigate to article
  const onNodeClick = useCallback(
    async (event: React.MouseEvent, node: Node) => {
      const nodeData = mindMapData?.nodes.find((n) => n.id === node.id);
      if (nodeData?.data?.articleId) {
        setLoading(true);
        try {
          // Load the article
          const articlePath = `/src/content/articles/${nodeData.category}/${nodeData.data.articleId}.md`;
          const response = await fetch(articlePath);
          if (!response.ok) throw new Error('Failed to load article');

          const markdownContent = await response.text();
          const { parseArticleFromMarkdown } = await import('@utils/markdownParser');
          const article = await parseArticleFromMarkdown(
            markdownContent,
            nodeData.data.articleId
          );

          setCurrentArticle(article);
        } catch (error) {
          console.error('Error loading article from mind map:', error);
        } finally {
          setLoading(false);
        }
      }
    },
    [mindMapData, setCurrentArticle, setLoading]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="anime-spinner"></div>
      </div>
    );
  }

  if (!mindMapData || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No mind map data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#FFB3D9" />
        <Controls
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #FF6B9D',
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </div>
  );
}
