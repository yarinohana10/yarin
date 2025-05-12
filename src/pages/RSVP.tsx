
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, X, Phone, HelpCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWeddingStore } from '@/lib/store';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const RSVP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { weddingDetails } = useWeddingStore();
  
  const weddingId = "3a01ab2d-623e-4741-97d9-49260f46b901";
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dbWeddingDetails, setDbWeddingDetails] = useState<any>(null);
  
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('1');
  const [guestMeals, setGuestMeals] = useState<string[]>(['רגיל']);
  
  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('wedding_events')
          .select('*')
          .eq('id', weddingId)
          .single();
            
        if (error) {
          console.error('Error fetching wedding:', error);
          setLoading(false);
          return;
        }
        
        setDbWeddingDetails(data);
      } catch (err) {
        console.error('Exception fetching wedding:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeddingDetails();
  }, []);
  
  const backgroundStyle = {
    backgroundImage: weddingDetails.backgroundImage 
      ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${weddingDetails.backgroundImage})` 
      : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/5e2b1d00-93e9-43a5-a19a-6d625b2e97af.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };
  
  const handleGuestCountChange = (value: string) => {
    const count = parseInt(value) || 1;
    setNumberOfGuests(value);
    
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
      // console.log("Checking for existing guest with name:", guestName, "and phone:", phoneNumber);
      
      const { data: existingGuests, error: fetchError } = await supabase
        .from('guests')
        .select('id')
        .eq('wedding_id', weddingId)
        .eq('full_name', guestName);
      
      if (fetchError) throw fetchError;
      
      const combinedMealPreferences = guestMeals.join(', ');
      
      if (existingGuests && existingGuests.length > 0) {
        const { error } = await supabase
          .from('guests')
          .update({
            status: attending,
            guest_count: parseInt(numberOfGuests),
            meal_preference: combinedMealPreferences,
            phone_number: phoneNumber || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingGuests[0].id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('guests')
          .insert({
            wedding_id: weddingId,
            full_name: guestName,
            phone_number: phoneNumber || null,
            status: attending,
            guest_count: parseInt(numberOfGuests),
            meal_preference: combinedMealPreferences,
          });
          
        if (error) throw error;
      }
      
      navigate('/thank-you', { state: { attending } });
      
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת האישור",
        description: error.message || "אירעה שגיאה בעת שליחת האישור. אנא נסה שנית."
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
          <p className="mt-4">טוען...</p>
        </div>
      </div>
    );
  }
  
  if (!dbWeddingDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">
              לא נמצא אירוע
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              האירוע שחיפשת לא נמצא. אנא וודא שהקישור שקיבלת תקין.
            </p>
            <Link to="/">
              <Button>
                חזרה לדף הראשי
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Fix: Using weddingDate instead of wedding_date property
  const weddingDate = weddingDetails?.weddingDate ? new Date(weddingDetails.weddingDate) : new Date();
  const formattedDate = weddingDate.toLocaleDateString('he-IL');
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4" 
      style={backgroundStyle}
    >
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            חזרה לדף הראשי
          </Button>
        </Link>
      </div>
      
      <div className="max-w-md w-full">
        <Card className="shadow-xl bg-white/95">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-rose-600">
              אישור הגעה לחתונה
            </CardTitle>
            <p className="text-gray-600 mt-1">
              {weddingDetails?.coupleNames} | {formattedDate}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2 text-right">
                <Label htmlFor="rsvp-name" className="text-gray-700">שם מלא</Label>
                <Input
                  dir="rtl"
                  id="rsvp-name"
                  placeholder="הזן את שמך המלא"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2 text-right">
                <Label htmlFor="phone-number" className="text-gray-700 inline-block w-full text-right">
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
                  onChange={handlePhoneNumberChange}
                  className="text-right"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500">*נדרש 10 ספרות</p>
              </div>
              
              <div className="space-y-2 text-right">
                <Label htmlFor="number-of-guests" className="text-gray-700">כמות אורחים</Label>
                <Select
                  value={numberOfGuests}
                  onValueChange={handleGuestCountChange}
                >
                  <SelectTrigger id="number-of-guests" className="text-right">
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
              
              {Array.from({ length: parseInt(numberOfGuests) }).map((_, index) => (
                <div key={index} className="space-y-2 text-right border-t pt-2 border-dashed border-gray-200 first:border-0 first:pt-0">
                  <Label htmlFor={`meal-preference-${index}`} className="text-gray-700">
                    {index === 0 ? 'העדפת מנה שלך' : `העדפת מנה - אורח ${index + 1}`}
                  </Label>
                  <Select
                    value={guestMeals[index]}
                    onValueChange={(value) => updateGuestMeal(index, value)}
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
                    className="py-8 bg-green-500 hover:bg-green-600 text-white shadow-md transition-all"
                    onClick={() => handleRSVP('attending')}
                    disabled={submitting}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    {submitting ? 'מעבד...' : 'מגיע/ה'}
                  </Button>
                  
                  <Button 
                    className="py-8 bg-yellow-500 hover:bg-yellow-600 text-white shadow-md transition-all"
                    onClick={() => handleRSVP('maybe')}
                    disabled={submitting}
                  >
                    <HelpCircle className="mr-2 h-5 w-5" />
                    {submitting ? 'מעבד...' : 'אולי'}
                  </Button>
                  
                  <Button 
                    className="py-8 bg-red-500 hover:bg-red-600 text-white shadow-md transition-all"
                    onClick={() => handleRSVP('declined')}
                    disabled={submitting}
                  >
                    <X className="mr-2 h-5 w-5" />
                    {submitting ? 'מעבד...' : 'לא מגיע/ה'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RSVP;
