
import { Card } from '@/components/ui/card';
import { GuestsTable } from '@/components/GuestsTable';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

type GuestsManagementProps = {
  weddingId: string;
  onRefresh: () => void;
};

export const GuestsManagement = ({ weddingId, onRefresh }: GuestsManagementProps) => {
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    // Call the parent refresh function to update guest stats
    onRefresh();
  };

  const handleExportToExcel = async () => {
    if (isExporting) return;
    
    try {
      setIsExporting(true);
      
      // Fetch all guests for the wedding
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('wedding_id', weddingId);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: 'אין נתונים לייצוא',
          description: 'רשימת האורחים ריקה',
          variant: 'destructive',
        });
        return;
      }
      
      // Transform data for Excel
      const worksheet = XLSX.utils.json_to_sheet(
        data.map(guest => ({
          'שם מלא': guest.full_name,
          'טלפון': guest.phone_number || '',
          'סטטוס': translateStatus(guest.status),
          'כמות אורחים': guest.guest_count,
          'העדפת מנה': guest.meal_preference || 'רגיל',
        }))
      );
      
      // Create workbook and append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'אורחים');
      
      // Generate Excel file
      XLSX.writeFile(workbook, 'אורחים.xlsx');
      
      toast({
        title: 'הקובץ יוצא בהצלחה',
        description: 'אורחים.xlsx נשמר בהצלחה',
      });
    } catch (error: any) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: 'שגיאה בייצוא הנתונים',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const translateStatus = (status: string) => {
    switch (status) {
      case 'attending': return 'מגיע/ה';
      case 'declined': return 'לא מגיע/ה';
      case 'maybe': return 'אולי מגיע/ה';
      case 'pending': return 'טרם אישר/ה';
      default: return status;
    }
  };

  return (
    <Card className="shadow-md p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">ניהול אורחים</h2>
        <Button 
          variant="outline" 
          className="flex gap-2"
          onClick={handleExportToExcel}
          disabled={isExporting}
        >
          <FileSpreadsheet className="h-4 w-4" />
          {isExporting ? 'מייצא...' : 'ייצוא לאקסל'}
        </Button>
      </div>
      
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
            onRefresh={handleRefresh}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
