
export interface StellarDataPoint {
  id: string;
  name: string;
  type: 'star' | 'nebula' | 'planet' | 'blackHole' | 'galaxy';
  magnitude: number;
  distance: number; // in light years
  temperature: number; // in kelvin
  color: string;
  size: number; // relative size for visualization
  description: string;
  connections: string[]; // ids of connected data points
}

export const stellarData: StellarDataPoint[] = [
  {
    id: 'star-1',
    name: 'Sirius',
    type: 'star',
    magnitude: -1.46,
    distance: 8.6,
    temperature: 9940,
    color: '#A3E4FF',
    size: 30,
    description: 'Brightest star in Earth\'s night sky, located in Canis Major constellation.',
    connections: ['star-3', 'planet-2']
  },
  {
    id: 'star-2',
    name: 'Betelgeuse',
    type: 'star',
    magnitude: 0.5,
    distance: 548,
    temperature: 3500,
    color: '#FF8C52',
    size: 45,
    description: 'Red supergiant star in Orion, nearing the end of its life cycle.',
    connections: ['nebula-1', 'star-5']
  },
  {
    id: 'star-3',
    name: 'Vega',
    type: 'star',
    magnitude: 0.03,
    distance: 25,
    temperature: 9602,
    color: '#CAFAFF',
    size: 25,
    description: 'Fifth-brightest star in the night sky and second-brightest in northern hemisphere.',
    connections: ['star-1', 'planet-1']
  },
  {
    id: 'star-4',
    name: 'Antares',
    type: 'star',
    magnitude: 1.09,
    distance: 550,
    temperature: 3400,
    color: '#FF5733',
    size: 40,
    description: 'Red supergiant star in the constellation Scorpius.',
    connections: ['star-5', 'nebula-2']
  },
  {
    id: 'star-5',
    name: 'Proxima Centauri',
    type: 'star',
    magnitude: 11.13,
    distance: 4.2,
    temperature: 3042,
    color: '#FF7B61',
    size: 15,
    description: 'Closest known star to the Sun, part of the Alpha Centauri system.',
    connections: ['planet-1', 'star-2']
  },
  {
    id: 'planet-1',
    name: 'Proxima b',
    type: 'planet',
    magnitude: 0,
    distance: 4.2,
    temperature: 234,
    color: '#6CA6FF',
    size: 12,
    description: 'Exoplanet orbiting Proxima Centauri, potentially habitable.',
    connections: ['star-5', 'star-3']
  },
  {
    id: 'planet-2',
    name: 'Kepler-186f',
    type: 'planet',
    magnitude: 0,
    distance: 582,
    temperature: 188,
    color: '#5A7BFF',
    size: 14,
    description: 'Exoplanet orbiting within the habitable zone of Kepler-186.',
    connections: ['star-1', 'nebula-1']
  },
  {
    id: 'nebula-1',
    name: 'Orion Nebula',
    type: 'nebula',
    magnitude: 4.0,
    distance: 1344,
    temperature: 10000,
    color: '#FFA3DB',
    size: 60,
    description: 'Brightest and most visible nebula from Earth, visible to the naked eye.',
    connections: ['star-2', 'nebula-2', 'planet-2']
  },
  {
    id: 'nebula-2',
    name: 'Crab Nebula',
    type: 'nebula',
    magnitude: 8.4,
    distance: 6523,
    temperature: 11600,
    color: '#C08FFF',
    size: 55,
    description: 'Supernova remnant and pulsar wind nebula in the constellation of Taurus.',
    connections: ['star-4', 'nebula-1', 'blackHole-1']
  },
  {
    id: 'blackHole-1',
    name: 'Sagittarius A*',
    type: 'blackHole',
    magnitude: 0,
    distance: 26673,
    temperature: 0,
    color: '#330033',
    size: 50,
    description: 'Supermassive black hole at the center of the Milky Way galaxy.',
    connections: ['nebula-2', 'galaxy-1']
  },
  {
    id: 'galaxy-1',
    name: 'Andromeda Galaxy',
    type: 'galaxy',
    magnitude: 3.44,
    distance: 2537000,
    temperature: 0,
    color: '#8B5CF6',
    size: 70,
    description: 'Nearest major galaxy to the Milky Way, visible to the naked eye on moonless nights.',
    connections: ['blackHole-1']
  }
];

export const getRandomDataPoint = (): StellarDataPoint => {
  const index = Math.floor(Math.random() * stellarData.length);
  return stellarData[index];
};

export const getDataPointById = (id: string): StellarDataPoint | undefined => {
  return stellarData.find(point => point.id === id);
};

export const getConnectedDataPoints = (id: string): StellarDataPoint[] => {
  const dataPoint = getDataPointById(id);
  if (!dataPoint) return [];
  
  return dataPoint.connections
    .map(connectedId => getDataPointById(connectedId))
    .filter((point): point is StellarDataPoint => !!point);
};
