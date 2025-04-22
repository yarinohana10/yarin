
import React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          isMobile ? "fixed inset-y-0 left-0 z-40" : "w-64",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        <Sidebar />
      </div>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto bg-background",
        className
      )}>
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
