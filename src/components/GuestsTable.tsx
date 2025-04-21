import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileSpreadsheet, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import { GuestTableRow } from './guests/GuestTableRow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoadingState } from './admin/LoadingState';
import { useToast } from '@/hooks/use-toast';
import { useGuests } from '@/hooks/useGuests';
import { AddGuestForm } from './guests/AddGuestForm';

interface GuestsTableProps {
  weddingId: string | undefined;
  status: 'attending' | 'declined' | 'maybe' | 'pending' | 'all';
  onRefresh?: () => void;
}

export function GuestsTable({ weddingId, status, onRefresh }: GuestsTableProps) {
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const { toast } = useToast();
  const { guests, loading, fetchGuests, handleDeleteGuest } = useGuests(weddingId, status);

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
    
    const fileName = status === 'all' ? 'כל האורחים' : 
                    status === 'attending' ? 'אורחים מגיעים' :
                    status === 'declined' ? 'אורחים לא מגיעים' :
                    status === 'maybe' ? 'אורחים אולי מגיעים' : 'אורחים בהמתנה';
    
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    toast({
      title: 'הקובץ יוצא בהצלחה',
      description: `${fileName}.xlsx נשמר בהצלחה`,
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

  const handleGuestUpdate = () => {
    console.log("Refreshing guest list...");
    fetchGuests();
    if (onRefresh) onRefresh();
  };

  const deleteGuest = async (guestId: string) => {
    console.log("Deleting guest with ID:", guestId);
    
    const success = await handleDeleteGuest(guestId);
    console.log("Deletion result:", success);
    
    if (success) {
      console.log("Deletion successful, refreshing lists");
      
      fetchGuests();
      
      if (onRefresh) {
        console.log("Calling onRefresh after successful deletion");
        onRefresh();
      }
    }
    
    return success;
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          className="flex gap-2 mr-4 mb-4" 
          onClick={() => setIsAddGuestOpen(true)}
        >
          <Plus className="h-4 w-4" />
          הוסף אורח
        </Button>
        
        <Button 
          variant="outline" 
          className="flex gap-2 ml-4"
          onClick={handleExportToExcel}
          disabled={guests.length === 0}
        >
          <FileSpreadsheet className="h-4 w-4" />
          ייצוא לאקסל
        </Button>
      </div>
      
      {guests.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">אין אורחים {status !== 'all' ? translateStatus(status) : ''}. הוסף אורחים חדשים כדי להתחיל.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right font-bold">שם מלא</TableHead>
                <TableHead className="text-right font-bold">טלפון</TableHead>
                <TableHead className="text-right font-bold">סטטוס</TableHead>
                <TableHead className="text-center font-bold">כמות</TableHead>
                <TableHead className="text-right font-bold">העדפת מנה</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <GuestTableRow 
                  key={guest.id} 
                  guest={guest}
                  onDelete={deleteGuest}
                  onUpdate={handleGuestUpdate}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-right">הוספת אורח חדש</DialogTitle>
            <DialogDescription className="text-right">
              הזן את פרטי האורח החדש כאן
            </DialogDescription>
          </DialogHeader>
          {weddingId && (
            <AddGuestForm
              weddingId={weddingId}
              onSuccess={() => {
                setIsAddGuestOpen(false);
                handleGuestUpdate();
              }}
              onCancel={() => setIsAddGuestOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
