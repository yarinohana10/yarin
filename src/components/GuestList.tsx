
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, HelpCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

type Guest = {
  id: string;
  full_name: string;
  phone_number: string | null;
  status: 'attending' | 'declined' | 'maybe' | 'pending';
  guest_count: number;
  meal_preference: string | null;
};

export const GuestList = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const weddingId = "3a01ab2d-623e-4741-97d9-49260f46b901";
  
  useEffect(() => {
    const fetchGuests = async () => {
      if (!weddingId) return;
      
      try {
        setLoading(true);
        // Use the standard anon key, not auth
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .eq('wedding_id', weddingId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setGuests(data as Guest[]);
        }
      } catch (error) {
        console.error('Error fetching guests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuests();
  }, []);
  
  const handleExportToExcel = () => {
    if (guests.length === 0) {
      toast({
        title: 'אין נתונים לייצוא',
        description: 'רשימת האורחים ריקה',
        variant: 'destructive',
      });
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(
      guests.map(guest => ({
        'שם מלא': guest.full_name,
        'טלפון': guest.phone_number || '',
        'סטטוס': translateStatus(guest.status),
        'כמות אורחים': guest.guest_count,
        'העדפת מנה': guest.meal_preference || 'רגיל',
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'אורחים');
    
    XLSX.writeFile(workbook, 'אורחים.xlsx');
    
    toast({
      title: 'הקובץ יוצא בהצלחה',
      description: 'אורחים.xlsx נשמר בהצלחה',
    });
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
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto"></div>
        <p className="mt-4 text-gray-500">טוען רשימת אורחים...</p>
      </div>
    );
  }
  
  if (guests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="mb-4">עדיין אין אישורי הגעה</p>
        <p className="text-sm">כאשר אורחים יאשרו הגעה, הם יופיעו כאן</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="flex gap-2"
          onClick={handleExportToExcel}
        >
          <FileSpreadsheet className="h-4 w-4" />
          ייצוא לאקסל
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right font-bold">שם</TableHead>
              <TableHead className="text-right font-bold">סטטוס</TableHead>
              <TableHead className="text-right font-bold">טלפון</TableHead>
              <TableHead className="text-center font-bold">כמות</TableHead>
              <TableHead className="text-right font-bold">העדפת מנה</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium text-right">{guest.full_name}</TableCell>
                <TableCell className="text-right">
                  {guest.status === 'attending' ? (
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                      <span>מגיע/ה</span>
                    </div>
                  ) : guest.status === 'declined' ? (
                    <div className="flex items-center">
                      <X className="h-4 w-4 text-red-500 mr-1" />
                      <span>לא מגיע/ה</span>
                    </div>
                  ) : guest.status === 'maybe' ? (
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>אולי מגיע/ה</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span>טרם אישר/ה</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">{guest.phone_number || '-'}</TableCell>
                <TableCell className="text-center">
                  {guest.guest_count === 1 ? (
                    <span>{guest.guest_count}</span>
                  ) : (
                    <span className="font-medium">{guest.guest_count} אנשים</span>
                  )}
                </TableCell>
                <TableCell className="text-right">{guest.meal_preference || 'רגיל'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
