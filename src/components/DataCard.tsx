
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StellarDataPoint } from '@/data/stellarData';
import { formatDistance, formatTemperature, getTypeIcon, getTypeName } from '@/utils/visualizationUtils';

interface DataCardProps {
  data: StellarDataPoint;
  onClick?: () => void;
  isSelected?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({ 
  data, 
  onClick,
  isSelected = false
}) => {
  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer hover:scale-105 ${
        isSelected 
          ? 'border-2 border-space-accent shadow-lg glow-box' 
          : 'border border-border'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold glow">
              {data.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <span className="text-lg">{getTypeIcon(data.type)}</span>
              <span>{getTypeName(data.type)}</span>
            </CardDescription>
          </div>
          <div 
            className="w-8 h-8 rounded-full animate-pulse-glow" 
            style={{ backgroundColor: data.color }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Distance</span>
            <span className="font-medium">{formatDistance(data.distance)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Temperature</span>
            <span className="font-medium">{formatTemperature(data.temperature)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Magnitude</span>
            <span className="font-medium">
              {data.magnitude === 0 ? 'N/A' : data.magnitude}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Connections</span>
            <span className="font-medium">{data.connections.length}</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {data.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default DataCard;
