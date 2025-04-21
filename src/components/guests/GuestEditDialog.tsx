
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Guest } from './types';

interface GuestEditDialogProps {
  guest: Guest;
  onUpdate: () => void;
}

export function GuestEditDialog({ guest, onUpdate }: GuestEditDialogProps) {
  const [editGuest, setEditGuest] = useState(guest);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUpdateGuest = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('guests')
        .update({
          full_name: editGuest.full_name,
          phone_number: editGuest.phone_number,
          status: editGuest.status,
          guest_count: editGuest.guest_count,
          meal_preference: editGuest.meal_preference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editGuest.id);

      if (error) throw error;

      toast({
        title: 'פרטי האורח עודכנו בהצלחה',
      });

      // Call onUpdate to refresh the parent components
      onUpdate();
    } catch (error: any) {
      console.error('Error updating guest:', error);
      toast({
        title: 'שגיאה בעדכון פרטי האורח',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const numberOnly = phone.replace(/\D/g, '');
    return numberOnly.length <= 10;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validatePhoneNumber(value)) {
      setEditGuest({ ...editGuest, phone_number: value });
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-right">עריכת פרטי אורח</DialogTitle>
        <DialogDescription className="text-right">
          ערוך את פרטי האורח כאן.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 text-right">
        <div className="space-y-2">
          <Label htmlFor="edit-name">שם מלא</Label>
          <Input 
            id="edit-name" 
            className="text-right" 
            dir="rtl"
            value={editGuest.full_name}
            onChange={(e) => setEditGuest({...editGuest, full_name: e.target.value})}
            placeholder="הזן שם מלא"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-phone">מספר טלפון</Label>
          <Input 
            id="edit-phone" 
            className="text-right" 
            dir="rtl"
            value={editGuest.phone_number || ''}
            onChange={handlePhoneChange}
            placeholder="הזן מספר טלפון"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-status">סטטוס</Label>
          <Select 
            value={editGuest.status} 
            onValueChange={(value: any) => setEditGuest({...editGuest, status: value})}
          >
            <SelectTrigger id="edit-status" className="text-right">
              <SelectValue placeholder="בחר סטטוס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attending">מגיע/ה</SelectItem>
              <SelectItem value="declined">לא מגיע/ה</SelectItem>
              <SelectItem value="maybe">אולי מגיע/ה</SelectItem>
              <SelectItem value="pending">טרם אישר/ה</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-count">כמות אורחים</Label>
          <Select 
            value={editGuest.guest_count.toString()} 
            onValueChange={(value) => setEditGuest({...editGuest, guest_count: parseInt(value)})}
          >
            <SelectTrigger id="edit-count" className="text-right">
              <SelectValue placeholder="בחר כמות" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-meal">העדפת מנה</Label>
          <Select 
            value={editGuest.meal_preference || 'רגיל'} 
            onValueChange={(value) => setEditGuest({...editGuest, meal_preference: value})}
          >
            <SelectTrigger id="edit-meal" className="text-right">
              <SelectValue placeholder="בחר העדפת מנה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="רגיל">רגיל</SelectItem>
              <SelectItem value="צמחוני">צמחוני</SelectItem>
              <SelectItem value="טבעוני">טבעוני</SelectItem>
              <SelectItem value="גלאט">גלאט</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter className="sm:justify-end">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            ביטול
          </Button>
        </DialogClose>
        <Button 
          type="button" 
          onClick={handleUpdateGuest}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'מעדכן...' : 'שמור שינויים'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
