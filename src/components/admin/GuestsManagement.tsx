
import { Card } from '@/components/ui/card';
import { GuestsTable } from '@/components/GuestsTable';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

type GuestsManagementProps = {
  weddingId: string;
  onRefresh: () => void;
};

export const GuestsManagement = ({ weddingId, onRefresh }: GuestsManagementProps) => {
  const [currentTab, setCurrentTab] = useState<string>("all");

  return (
    <Card className="shadow-md p-4">
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-5 mb-6 mx-auto max-w-2xl">
          <TabsTrigger value="all">
            הכל
          </TabsTrigger>
          <TabsTrigger value="attending">
            מגיעים
          </TabsTrigger>
          <TabsTrigger value="declined">
            לא מגיעים
          </TabsTrigger>
          <TabsTrigger value="maybe">
            אולי מגיעים
          </TabsTrigger>
          <TabsTrigger value="pending">
            טרם אישרו
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentTab}>
          <GuestsTable 
            weddingId={weddingId} 
            status={currentTab as any} 
            onRefresh={onRefresh}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
