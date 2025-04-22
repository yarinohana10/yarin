
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  CreditCard, 
  Home, 
  Settings, 
  Users, 
  PieChart, 
  CircleUser, 
  LogOut 
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const location = useLocation();
  
  return (
    <div className={cn("pb-12 bg-sidebar text-sidebar-foreground h-screen flex flex-col", className)} {...props}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight text-sidebar-foreground">
            DSD
          </h2>
          <div className="space-y-1">
            <SidebarItem icon={<Home size={20} />} href="/" active={location.pathname === "/"}>
              Dashboard
            </SidebarItem>
            <SidebarItem icon={<BarChart3 size={20} />} href="/analytics" active={location.pathname.startsWith("/analytics")}>
              Analytics
            </SidebarItem>
            <SidebarItem icon={<CreditCard size={20} />} href="/transactions" active={location.pathname.startsWith("/transactions")}>
              Transactions
            </SidebarItem>
            <SidebarItem icon={<Users size={20} />} href="/customers" active={location.pathname.startsWith("/customers")}>
              Customers
            </SidebarItem>
            <SidebarItem icon={<PieChart size={20} />} href="/reports" active={location.pathname.startsWith("/reports")}>
              Reports
            </SidebarItem>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-sidebar-foreground">
            Account
          </h2>
          <div className="space-y-1">
            <SidebarItem icon={<CircleUser size={20} />} href="/profile" active={location.pathname.startsWith("/profile")}>
              Profile
            </SidebarItem>
            <SidebarItem icon={<Settings size={20} />} href="/settings" active={location.pathname.startsWith("/settings")}>
              Settings
            </SidebarItem>
            <SidebarItem icon={<LogOut size={20} />} href="/logout" active={location.pathname.startsWith("/logout")}>
              Logout
            </SidebarItem>
          </div>
        </div>
      </div>
      <div className="mt-auto px-4 py-2">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent p-3">
          <h3 className="font-medium text-sm text-sidebar-foreground">Need Help?</h3>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Check our documentation or contact support.</p>
          <Link to="/help" className="inline-block text-xs text-primary mt-2 hover:underline">Learn more</Link>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon, children, href, active }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active 
          ? "bg-sidebar-primary text-sidebar-primary-foreground" 
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
