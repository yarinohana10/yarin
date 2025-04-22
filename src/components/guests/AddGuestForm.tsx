
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

interface AddGuestFormProps {
  weddingId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddGuestForm({ weddingId, onSuccess, onCancel }: AddGuestFormProps) {
  const [newGuest, setNewGuest] = useState({
    full_name: '',
    phone_number: '',
    status: 'pending',
    guest_count: 1,
  });
  // כל מנה אורח
  const [guestMeals, setGuestMeals] = useState<string[]>(['רגיל']);
  const { toast } = useToast();

  // התרעננות לפי כמות מגיעים
  const handleGuestCountChange = (value: string) => {
    const count = parseInt(value, 10) || 1;
    setNewGuest({ ...newGuest, guest_count: count });
    setGuestMeals((prev) => {
      const arr = [...prev];
      while (arr.length < count) arr.push('רגיל');
      while (arr.length > count) arr.pop();
      return arr;
    });
  };

  const validatePhoneNumber = (phone: string) => {
    const numberOnly = phone.replace(/\D/g, '');
    return numberOnly.length <= 10;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validatePhoneNumber(value)) {
      setNewGuest({ ...newGuest, phone_number: value });
    }
  };

  const handleAddGuest = async () => {
    if (!newGuest.full_name) {
      toast({
        title: 'שגיאה',
        description: 'נא למלא את כל השדות הנדרשים',
        variant: 'destructive',
      });
      return;
    }

    try {
      const meal_preference = guestMeals.join(', ');
      const { error } = await supabase
        .from('guests')
        .insert({
          wedding_id: weddingId,
          full_name: newGuest.full_name,
          phone_number: newGuest.phone_number || null,
          status: newGuest.status,
          guest_count: newGuest.guest_count,
          meal_preference,
        });

      if (error) throw error;

      toast({
        title: 'האורח נוסף בהצלחה',
      });

      onSuccess();

    } catch (error: any) {
      console.error('Error adding guest:', error);
      toast({
        title: 'שגיאה בהוספת האורח',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 py-4 text-right">
      <div className="space-y-2">
        <Label htmlFor="full-name">שם מלא</Label>
        <Input 
          id="full-name"
          className="text-right"
          dir="rtl"
          value={newGuest.full_name}
          onChange={(e) => setNewGuest({...newGuest, full_name: e.target.value})}
          placeholder="הזן שם מלא"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-number">מספר טלפון</Label>
        <Input 
          id="phone-number"
          className="text-right"
          dir="rtl"
          value={newGuest.phone_number}
          onChange={handlePhoneChange}
          placeholder="הזן מספר טלפון"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">סטטוס</Label>
        <Select 
          value={newGuest.status} 
          onValueChange={(value) => setNewGuest({...newGuest, status: value})}
        >
          <SelectTrigger id="status" className="text-right">
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
        <Label htmlFor="guest-count">כמות אורחים</Label>
        <Select 
          value={newGuest.guest_count.toString()} 
          onValueChange={handleGuestCountChange}
        >
          <SelectTrigger id="guest-count" className="text-right">
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
      {/* כאן מוסיפים בחירת מנת אוכל לכל אורח */}
      {Array.from({ length: newGuest.guest_count }).map((_, idx) => (
        <div key={idx} className="space-y-2">
          <Label htmlFor={`meal-preference-${idx}`}>
            {idx === 0 ? 'העדפת מנה שלך' : `העדפת מנה - אורח ${idx + 1}`}
          </Label>
          <Select
            value={guestMeals[idx]}
            onValueChange={value => {
              setGuestMeals(prev => {
                const arr = [...prev];
                arr[idx] = value;
                return arr;
              });
            }}
          >
            <SelectTrigger id={`meal-preference-${idx}`} className="text-right">
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
      ))}
      <DialogFooter className="sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="button" onClick={handleAddGuest}>
          הוסף אורח
        </Button>
      </DialogFooter>
    </div>
  );
}
