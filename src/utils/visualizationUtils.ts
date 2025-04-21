import { StellarDataPoint } from "../data/stellarData";

// Generate random position within boundaries
export const generateRandomPosition = (
  width: number,
  height: number,
  margin: number = 50
) => {
  return {
    x: margin + Math.random() * (width - margin * 2),
    y: margin + Math.random() * (height - margin * 2)
  };
};

// Force-directed graph utils
export const calculateForces = (
  nodes: Array<StellarDataPoint & { x: number; y: number }>,
  links: Array<{ source: string; target: string }>,
  width: number,
  height: number
) => {
  const updatedNodes = [...nodes];
  
  // Repulsive force between nodes
  for (let i = 0; i < updatedNodes.length; i++) {
    for (let j = i + 1; j < updatedNodes.length; j++) {
      const dx = updatedNodes[j].x - updatedNodes[i].x;
      const dy = updatedNodes[j].y - updatedNodes[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Minimum distance to prevent excessive repulsion
      const minDistance = 100;
      
      if (distance < minDistance) {
        const repulsiveForce = 1 / (distance * distance) * 50;
        const forceX = (dx / distance) * repulsiveForce;
        const forceY = (dy / distance) * repulsiveForce;
        
        updatedNodes[i].x -= forceX;
        updatedNodes[i].y -= forceY;
        updatedNodes[j].x += forceX;
        updatedNodes[j].y += forceY;
      }
    }
  }
  
  // Attractive force between connected nodes
  links.forEach(link => {
    const sourceNode = updatedNodes.find(node => node.id === link.source);
    const targetNode = updatedNodes.find(node => node.id === link.target);
    
    if (sourceNode && targetNode) {
      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Optimal distance for connections
      const optimalDistance = 150;
      const attractiveForce = (distance - optimalDistance) / 10;
      
      const forceX = (dx / distance) * attractiveForce;
      const forceY = (dy / distance) * attractiveForce;
      
      sourceNode.x += forceX;
      sourceNode.y += forceY;
      targetNode.x -= forceX;
      targetNode.y -= forceY;
    }
  });
  
  // Keep nodes within boundaries
  updatedNodes.forEach(node => {
    const margin = 30;
    node.x = Math.max(margin, Math.min(width - margin, node.x));
    node.y = Math.max(margin, Math.min(height - margin, node.y));
  });
  
  return updatedNodes;
};

// Get path for curved connection lines
export const getCurvedPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curvature: number = 0.2
) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Find perpendicular point for curve
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate control point offset perpendicular to the line
  const perpX = midX - dy * curvature;
  const perpY = midY + dx * curvature;
  
  return `M ${x1} ${y1} Q ${perpX} ${perpY} ${x2} ${y2}`;
};

// Format temperature with appropriate unit
export const formatTemperature = (kelvin: number) => {
  if (kelvin === 0) return 'N/A';
  return `${kelvin.toLocaleString()} K`;
};

// Format distance with appropriate unit
export const formatDistance = (lightYears: number) => {
  if (lightYears < 10) {
    return `${lightYears.toFixed(1)} light years`;
  } else if (lightYears < 1000) {
    return `${Math.round(lightYears)} light years`;
  } else if (lightYears < 1000000) {
    return `${(lightYears / 1000).toFixed(1)} kilolight years`;
  } else {
    return `${(lightYears / 1000000).toFixed(1)} megalight years`;
  }
};

// Get icon for different stellar object types
export const getTypeIcon = (type: StellarDataPoint['type']) => {
  switch (type) {
    case 'star':
      return '★';
    case 'planet':
      return '○';
    case 'nebula':
      return '☁';
    case 'blackHole':
      return '◉';
    case 'galaxy':
      return '✧';
    default:
      return '•';
  }
};

// Get a human-readable type name
export const getTypeName = (type: StellarDataPoint['type']) => {
  switch (type) {
    case 'star':
      return 'Star';
    case 'planet':
      return 'Planet';
    case 'nebula':
      return 'Nebula';
    case 'blackHole':
      return 'Black Hole';
    case 'galaxy':
      return 'Galaxy';
    default:
      return 'Unknown';
  }
};
