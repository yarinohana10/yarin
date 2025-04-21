
import React, { useEffect, useRef, useState } from 'react';
import { stellarData, StellarDataPoint } from '@/data/stellarData';
import { calculateForces, getCurvedPath, generateRandomPosition } from '@/utils/visualizationUtils';

interface NodeWithPosition extends StellarDataPoint {
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
}

interface DataStreamVisualizationProps {
  selectedId?: string;
  onSelectNode: (id: string) => void;
  width: number;
  height: number;
}

const DataStreamVisualization: React.FC<DataStreamVisualizationProps> = ({
  selectedId,
  onSelectNode,
  width,
  height
}) => {
  const [nodes, setNodes] = useState<NodeWithPosition[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const simulationRef = useRef<number | null>(null);
  
  // Initialize nodes with positions and create links
  useEffect(() => {
    const initialNodes: NodeWithPosition[] = stellarData.map(node => ({
      ...node,
      ...generateRandomPosition(width, height)
    }));
    
    const initialLinks: Link[] = [];
    stellarData.forEach(node => {
      node.connections.forEach(target => {
        initialLinks.push({
          source: node.id,
          target
        });
      });
    });
    
    setNodes(initialNodes);
    setLinks(initialLinks);
    
    // Start simulation
    simulationRef.current = window.requestAnimationFrame(runSimulation);
    
    return () => {
      if (simulationRef.current) {
        window.cancelAnimationFrame(simulationRef.current);
      }
    };
  }, [width, height]);
  
  // Run the force-directed graph simulation
  const runSimulation = () => {
    setNodes(prevNodes => calculateForces(prevNodes, links, width, height));
    simulationRef.current = window.requestAnimationFrame(runSimulation);
  };
  
  const handleNodeClick = (id: string) => {
    onSelectNode(id);
  };
  
  return (
    <svg width={width} height={height} className="absolute top-0 left-0">
      {/* Connection lines */}
      {links.map((link, index) => {
        const source = nodes.find(node => node.id === link.source);
        const target = nodes.find(node => node.id === link.target);
        
        if (!source || !target) return null;
        
        const isSelected = selectedId && (selectedId === source.id || selectedId === target.id);
        
        return (
          <g key={`link-${index}`}>
            <path
              d={getCurvedPath(source.x, source.y, target.x, target.y)}
              stroke={isSelected ? "#8b5cf6" : "#475569"}
              strokeWidth={isSelected ? 2 : 1}
              fill="none"
              strokeOpacity={isSelected ? 1 : 0.4}
              className={isSelected ? "data-flow-line" : ""}
            />
            {isSelected && (
              <circle
                cx={(source.x + target.x) / 2 + (Math.random() * 20 - 10)}
                cy={(source.y + target.y) / 2 + (Math.random() * 20 - 10)}
                r={2}
                fill="#8b5cf6"
                className="animate-pulse-glow"
              />
            )}
          </g>
        );
      })}
      
      {/* Data nodes */}
      {nodes.map(node => {
        const isSelected = selectedId === node.id;
        const isConnected = selectedId
          ? links.some(
              link => 
                (link.source === selectedId && link.target === node.id) ||
                (link.source === node.id && link.target === selectedId)
            )
          : false;
            
        return (
          <g 
            key={node.id} 
            transform={`translate(${node.x}, ${node.y})`}
            onClick={() => handleNodeClick(node.id)}
            className="cursor-pointer transition-all duration-300"
          >
            <circle
              r={node.size / 2}
              fill={node.color}
              fillOpacity={selectedId ? (isSelected || isConnected ? 1 : 0.3) : 0.7}
              stroke={isSelected ? "#ffffff" : "none"}
              strokeWidth={2}
              className={`transition-all duration-300 ${isSelected ? 'animate-pulse-glow' : ''}`}
            />
            {(isSelected || (!selectedId || isConnected)) && (
              <text
                textAnchor="middle"
                y={-node.size / 2 - 5}
                fill={isSelected ? "#ffffff" : "#cbd5e1"}
                fontSize={12}
                className={`select-none ${isSelected ? 'font-bold' : 'font-normal'}`}
              >
                {node.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default DataStreamVisualization;
