
import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { GuestEditDialog } from './GuestEditDialog';
import { Guest } from './types';

interface GuestTableRowProps {
  guest: Guest;
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: () => void;
}

export function GuestTableRow({ guest, onDelete, onUpdate }: GuestTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const translateStatus = (status: string) => {
    switch (status) {
      case 'attending': return 'מגיע/ה';
      case 'declined': return 'לא מגיע/ה';
      case 'maybe': return 'אולי מגיע/ה';
      case 'pending': return 'טרם אישר/ה';
      default: return status;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'attending':
        return <Badge className="bg-green-500">{translateStatus(status)}</Badge>;
      case 'declined':
        return <Badge className="bg-red-500">{translateStatus(status)}</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-500">{translateStatus(status)}</Badge>;
      case 'pending':
        return <Badge className="bg-gray-500">{translateStatus(status)}</Badge>;
      default:
        return <Badge>{translateStatus(status)}</Badge>;
    }
  };
  
  const handleDelete = async () => {
    if (isDeleting) return; // Prevent double clicks
    
    setIsDeleting(true);
    try {
      console.log('Starting deletion process for guest ID:', guest.id);
      
      // Call the delete function and wait for the result
      const success = await onDelete(guest.id);
      console.log('Deletion response:', success);
      
      if (success) {
        // Close the alert dialog on success
        setIsAlertOpen(false);
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium text-right">{guest.full_name}</TableCell>
      <TableCell className="text-right">{guest.phone_number || '-'}</TableCell>
      <TableCell className="text-right">
        <StatusBadge status={guest.status} />
      </TableCell>
      <TableCell className="text-center">
        {guest.guest_count === 1 ? (
          <span>{guest.guest_count}</span>
        ) : (
          <span className="font-medium">{guest.guest_count} אנשים</span>
        )}
      </TableCell>
      <TableCell className="text-right">{guest.meal_preference || 'רגיל'}</TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <GuestEditDialog guest={guest} onUpdate={onUpdate} />
          </Dialog>

          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-right">מחיקת אורח</AlertDialogTitle>
                <AlertDialogDescription className="text-right">
                  האם אתה בטוח שברצונך למחוק את האורח "{guest.full_name}"?
                  פעולה זו אינה ניתנת לשחזור.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-end gap-2">
                <AlertDialogCancel>ביטול</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      מוחק...
                    </>
                  ) : (
                    'מחק'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
