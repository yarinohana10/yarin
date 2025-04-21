
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoonStar, BarChart3, Search, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRandomize: () => void;
  totalObjects: number;
}

const Header: React.FC<HeaderProps> = ({ onRandomize, totalObjects }) => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-space-deep bg-opacity-60 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <MoonStar className="w-6 h-6 text-space-accent" />
        <h1 className="text-xl font-bold text-white glow">Stellar Data Streams</h1>
      </div>
      
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <BarChart3 className="w-4 h-4 mr-1" />
        <span>Displaying <span className="text-white font-medium">{totalObjects}</span> cosmic objects</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search stellar objects..." 
            className="h-9 w-64 rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onRandomize}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Randomize</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
