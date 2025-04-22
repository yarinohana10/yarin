
import { DashboardLayout } from "@/components/dashboard-layout";
import { DataChart } from "@/components/data-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import { TrendingUp, TrendingDown, Users, Clock } from "lucide-react";

// Sample analytics data
const monthlyData = [
  { name: "Jan", visitors: 2100, pageviews: 4200, conversions: 190 },
  { name: "Feb", visitors: 2400, pageviews: 4800, conversions: 218 },
  { name: "Mar", visitors: 1900, pageviews: 3800, conversions: 171 },
  { name: "Apr", visitors: 2800, pageviews: 5600, conversions: 252 },
  { name: "May", visitors: 3100, pageviews: 6200, conversions: 279 },
  { name: "Jun", visitors: 2700, pageviews: 5400, conversions: 243 },
  { name: "Jul", visitors: 3300, pageviews: 6600, conversions: 297 },
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: April 22, 2025
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Visitors" 
              value="18,342" 
              icon={<Users className="text-muted-foreground" />}
              footer={<span className="flex items-center text-emerald-500"><TrendingUp size={12} className="mr-1" /> 14% from last month</span>}
            />
            <StatCard 
              title="Page Views" 
              value="36,782" 
              icon={<TrendingUp className="text-muted-foreground" />}
              footer={<span className="flex items-center text-emerald-500"><TrendingUp size={12} className="mr-1" /> 9% from last month</span>}
            />
            <StatCard 
              title="Bounce Rate" 
              value="42.3%" 
              icon={<TrendingDown className="text-muted-foreground" />}
              footer={<span className="flex items-center text-rose-500"><TrendingDown size={12} className="mr-1" /> 2% from last month</span>}
            />
            <StatCard 
              title="Avg. Session" 
              value="3m 24s" 
              icon={<Clock className="text-muted-foreground" />}
              footer={<span className="flex items-center text-emerald-500"><TrendingUp size={12} className="mr-1" /> 7% from last month</span>}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DataChart 
              title="Visitor Overview" 
              description="Monthly visitor data for the current year"
              type="area"
              data={monthlyData}
              dataKeys={["visitors"]}
              colors={["#3B82F6"]}
              height={300}
            />
            <DataChart 
              title="Page Views" 
              description="Monthly page view data for the current year"
              type="area"
              data={monthlyData}
              dataKeys={["pageviews"]}
              colors={["#A855F7"]}
              height={300}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed breakdown of key analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <DataChart 
                  title="" 
                  description=""
                  type="bar"
                  data={monthlyData}
                  dataKeys={["visitors", "conversions"]}
                  colors={["#3B82F6", "#14B8A6"]}
                  height={300}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { source: "Direct", percentage: 35, color: "bg-dsd-blue-500" },
                    { source: "Organic Search", percentage: 28, color: "bg-dsd-purple-500" },
                    { source: "Social Media", percentage: 22, color: "bg-dsd-indigo-500" },
                    { source: "Referrals", percentage: 10, color: "bg-dsd-teal-500" },
                    { source: "Other", percentage: 5, color: "bg-gray-400" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.source}</span>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div 
                          className={`h-2 rounded-full ${item.color}`} 
                          style={{ width: `${item.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Analytics;
