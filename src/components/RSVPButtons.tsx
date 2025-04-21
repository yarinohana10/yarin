import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, RefreshCw, ArrowLeft, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export const RSVPButtons = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const weddingId = "3a01ab2d-623e-4741-97d9-49260f46b901";
  const [loading, setLoading] = useState(false);
  
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [showPhoneLookup, setShowPhoneLookup] = useState(false);
  const [guestCount, setGuestCount] = useState('1');
  const [guestMeals, setGuestMeals] = useState<string[]>(['רגיל']);
  const [submitting, setSubmitting] = useState(false);
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };
  
  const handleGuestCountChange = (value: string) => {
    const count = parseInt(value) || 1;
    setGuestCount(value);
    
    setGuestMeals(prev => {
      const newMeals = [...prev];
      while (newMeals.length < count) {
        newMeals.push('רגיל');
      }
      while (newMeals.length > count) {
        newMeals.pop();
      }
      return newMeals;
    });
  };
  
  const updateGuestMeal = (index: number, meal: string) => {
    setGuestMeals(prev => {
      const newMeals = [...prev];
      newMeals[index] = meal;
      return newMeals;
    });
  };
  
  const handleRSVP = async (attending: 'attending' | 'declined' | 'maybe') => {
    if (submitting) return;
    
    if (!weddingId) {
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת האישור",
        description: "לא נמצא אירוע מתאים"
      });
      return;
    }
    
    if (!guestName.trim()) {
      toast({
        variant: "destructive",
        title: "אנא הזן את שמך",
        description: "עלינו לדעת מי מאשר הגעה"
      });
      return;
    }
    
    if (phoneNumber && phoneNumber.length !== 10) {
      toast({
        variant: "destructive",
        title: "מספר טלפון לא תקין",
        description: "אנא הזן מספר טלפון תקין (10 ספרות)"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data: existingGuests, error: checkError } = await supabase
        .from('guests')
        .select('id')
        .eq('wedding_id', weddingId)
        .eq('full_name', guestName)
        .eq('phone_number', phoneNumber)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking for existing guest:', checkError);
        throw checkError;
      }
      
      const combinedMealPreferences = guestMeals.join(', ');
      
      if (existingGuests) {
        const { error: updateError } = await supabase
          .from('guests')
          .update({
            status: attending,
            guest_count: parseInt(guestCount),
            meal_preference: combinedMealPreferences,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingGuests.id);
          
        if (updateError) {
          console.error('Error updating guest:', updateError);
          throw updateError;
        }
      } else {
        console.log("Creating new guest with wedding_id:", weddingId);
        const { error: insertError } = await supabase
          .from('guests')
          .insert({
            wedding_id: weddingId,
            full_name: guestName,
            phone_number: phoneNumber || null,
            status: attending,
            guest_count: parseInt(guestCount),
            meal_preference: combinedMealPreferences,
          });
          
        if (insertError) {
          console.error('Error inserting guest:', insertError);
          throw insertError;
        }
      }
      
      navigate('/thank-you', { state: { attending } });
      
      setGuestName('');
      setPhoneNumber('');
      setGuestCount('1');
      setGuestMeals(['רגיל']);
      setShowForm(false);
      setIsUpdateMode(false);
      setSubmitting(false);
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת האישור",
        description: error.message || "אירעה שגיאה בעת שליחת האישור. אנא נסה שנית."
      });
      setSubmitting(false);
    }
  };

  const handleLookupByPhone = async () => {
    if (!weddingId) {
      toast({
        variant: "destructive",
        title: "שגיאה בחיפוש",
        description: "לא נמצא אירוע מתאים"
      });
      return;
    }
    
    if (lookupPhone.length !== 10) {
      toast({
        variant: "destructive",
        title: "מספר טלפון לא תקין",
        description: "אנא הזן מספר טלפון תקין (10 ספרות)"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('wedding_id', weddingId)
        .eq('phone_number', lookupPhone)
        .maybeSingle();
        
      if (error) throw error;
        
      if (data) {
        const guestData = data as any;
        setGuestName(guestData.full_name);
        setPhoneNumber(lookupPhone);
        
        if (guestData.meal_preference) {
          const meals = guestData.meal_preference.split(', ');
          setGuestMeals(meals);
          setGuestCount(guestData.guest_count.toString());
        } else {
          setGuestMeals(['רגיל']);
          setGuestCount('1');
        }
        
        setShowPhoneLookup(false);
        setShowForm(true);
        
        toast({
          title: "נמצא אורח!",
          description: `ברוכים הבאים חזרה, ${guestData.full_name}. כעת תוכל/י לעדכן את הפרטים שלך.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "לא נמצא אורח",
          description: "לא נמצא אורח עם מספר הטלפון שהזנת."
        });
      }
    } catch (error: any) {
      console.error('Error looking up guest:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בחיפוש",
        description: error.message
      });
    }
  };
  
  const startRSVP = () => {
    setIsUpdateMode(false);
    setShowForm(true);
    setShowPhoneLookup(false);
  };

  const startUpdateRSVP = () => {
    setIsUpdateMode(true);
    setShowPhoneLookup(true);
    setShowForm(false);
  };
  
  const handleBack = () => {
    setShowForm(false);
    setShowPhoneLookup(false);
    setIsUpdateMode(false);
    setGuestName('');
    setPhoneNumber('');
    setLookupPhone('');
    setGuestCount('1');
    setGuestMeals(['רגיל']);
  };
  
  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }
  
  if (showPhoneLookup) {
    return (
      <Card className="w-full shadow-lg animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 ml-1" />
              חזרה לדף הראשי
            </Button>
            <h3 className="text-lg font-semibold text-center">עדכון אישור הגעה</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2 text-right">
              <Label htmlFor="lookup-phone" className="flex items-center justify-end gap-2">
                <span>מספר טלפון</span>
                <Phone className="h-4 w-4" />
              </Label>
              <Input
                dir="rtl"
                id="lookup-phone"
                type="tel"
                placeholder="הזן את מספר הטלפון שהזנת בהרשמה"
                value={lookupPhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    setLookupPhone(value);
                  }
                }}
                className="text-right"
                maxLength={10}
                autoFocus
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                className="flex-1 py-6"
                onClick={handleLookupByPhone}
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                חפש פרטים
              </Button>
              
              <Button 
                className="flex-1 py-6 bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={handleBack}
              >
                ביטול
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {!showForm ? (
        <div className="space-y-3">
          <Button 
            className="w-full text-lg py-6 bg-wedding-gradient hover:opacity-90 shadow-md animate-pulse-gentle"
            onClick={() => {
              setIsUpdateMode(false);
              setShowForm(true);
              setShowPhoneLookup(false);
            }}
          >
            לאישור הגעה לחץ כאן
          </Button>
          
          <Button 
            variant="outline"
            className="w-full text-md border-[#F0B6BC] text-[#1A1A2E] hover:bg-[#F0B6BC]/10"
            onClick={() => {
              setIsUpdateMode(true);
              setShowPhoneLookup(true);
              setShowForm(false);
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            אישרת כבר הגעה? לחץ כאן לעדכון
          </Button>
        </div>
      ) : (
        <Card className="w-full shadow-lg animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:text-gray-700"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 ml-1" />
                חזרה לדף הראשי
              </Button>
              <h3 className="text-lg font-semibold">אישור הגעה</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2 text-right">
                <Label htmlFor="guest-name">שם האורח/ת</Label>
                <Input
                  dir="rtl"
                  id="guest-name"
                  placeholder="הזן את שמך המלא"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="text-right"
                  autoFocus
                  disabled={isUpdateMode}
                />
              </div>
              
              <div className="space-y-2 text-right">
                <Label htmlFor="phone-number" className="inline-block w-full text-right">
                  <span className="flex items-center justify-end gap-2">
                    <span>מספר טלפון</span>
                    <Phone className="h-4 w-4" />
                  </span>
                </Label>
                <Input
                  dir="rtl"
                  id="phone-number"
                  type="tel"
                  placeholder="הזן מספר טלפון"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setPhoneNumber(value);
                    }
                  }}
                  className="text-right"
                  maxLength={10}
                  disabled={isUpdateMode}
                />
                <p className="text-xs text-gray-500 text-right">*נדרש 10 ספרות</p>
              </div>
              
              <div className="space-y-2 text-right">
                <Label htmlFor="guest-count">כמות אורחים</Label>
                <Select
                  value={guestCount}
                  onValueChange={(value) => {
                    const count = parseInt(value) || 1;
                    setGuestCount(value);
                    
                    setGuestMeals(prev => {
                      const newMeals = [...prev];
                      while (newMeals.length < count) {
                        newMeals.push('רגיל');
                      }
                      while (newMeals.length > count) {
                        newMeals.pop();
                      }
                      return newMeals;
                    });
                  }}
                >
                  <SelectTrigger id="guest-count" className="text-right">
                    <SelectValue placeholder="בחר כמות אורחים" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 text-right">*כולל אותך</p>
              </div>
              
              {Array.from({ length: parseInt(guestCount) }).map((_, index) => (
                <div key={index} className="space-y-2 text-right border-t pt-2 border-dashed border-gray-200 first:border-0 first:pt-0">
                  <Label htmlFor={`meal-preference-${index}`}>
                    {index === 0 ? 'העדפת מנה שלך' : `העדפת מנה - אורח ${index + 1}`}
                  </Label>
                  <Select
                    value={guestMeals[index]}
                    onValueChange={(value) => {
                      setGuestMeals(prev => {
                        const newMeals = [...prev];
                        newMeals[index] = value;
                        return newMeals;
                      });
                    }}
                  >
                    <SelectTrigger id={`meal-preference-${index}`} className="text-right">
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
              
              <div className="pt-4 text-center">
                <p className="mb-3 font-medium text-lg">האם תוכל/י להגיע לאירוע?</p>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    className="py-6 text-white hover:bg-[#F0B6BC] shadow-md transition-all"
                    style={{ backgroundColor: '#F0B6BC' }}
                    onClick={() => handleRSVP('attending')}
                    disabled={submitting}
                  >
                    <ThumbsUp className="mr-2 h-5 w-5" />
                    {submitting ? 'מעבד...' : 'מגיע/ה'}
                  </Button>
                  
                  <Button 
                    className="py-6 text-white hover:bg-yellow-500 shadow-md transition-all"
                    style={{ backgroundColor: '#f0b95a' }}
                    onClick={() => handleRSVP('maybe')}
                    disabled={submitting}
                  >
                    <HelpCircle className="mr-2 h-5 w-5" />
                    {submitting ? 'מעבד...' : 'אולי'}
                  </Button>
                  
                  <Button 
                    className="py-6 text-white hover:bg-gray-500 shadow-md transition-all"
                    style={{ backgroundColor: '#8E9196' }}
                    onClick={() => handleRSVP('declined')}
                    disabled={submitting}
                  >
                    <ThumbsDown className="mr-2 h-5 w-5" />
                    {submitting ? 'מעבד...' : 'לא מגיע/ה'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
