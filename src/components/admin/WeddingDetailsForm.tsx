import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Image, Loader2, Save, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BankTransferFields {
  bankAccountHolder: string;
  bankNumber: string;
  bankBranch: string;
  bankAccountNumber: string;
}

interface WeddingDetailsFormProps {
  weddingDetails: {
    id: string;
    coupleNames: string;
    weddingDate: string;
    venueName: string;
    venueAddress: string;
    venueMapLink: string;
    wazeLink: string;
    bitNumber: string;
    bankNumber: string;
    bankBranch: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
    backgroundImage: string;
  };
  onUpdate: (details: any) => void;
}

export const WeddingDetailsForm = ({ weddingDetails, onUpdate }: WeddingDetailsFormProps) => {
  const { toast } = useToast();
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [formData, setFormData] = React.useState(weddingDetails);

  const [bankTransfer, setBankTransfer] = React.useState<BankTransferFields>({
    bankAccountHolder: weddingDetails.bankAccountHolder,
    bankNumber: weddingDetails.bankNumber,
    bankBranch: weddingDetails.bankBranch,
    bankAccountNumber: weddingDetails.bankAccountNumber,
  });
  const [bankLoading, setBankLoading] = React.useState(false);

  React.useEffect(() => {
    setFormData(weddingDetails);
    setBankTransfer({
      bankAccountHolder: weddingDetails.bankAccountHolder,
      bankNumber: weddingDetails.bankNumber,
      bankBranch: weddingDetails.bankBranch,
      bankAccountNumber: weddingDetails.bankAccountNumber,
    });

    const fetchBankTransfer = async () => {
      if (!weddingDetails.id) return;
      setBankLoading(true);
      const { data, error } = await supabase
        .from('bank_transfers')
        .select('*')
        .eq('wedding_id', weddingDetails.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setBankTransfer({
          bankAccountHolder: data[0].bank_account_holder,
          bankNumber: data[0].bank_number,
          bankBranch: data[0].bank_branch,
          bankAccountNumber: data[0].bank_account_number,
        });
      }
      setBankLoading(false);
    };
    fetchBankTransfer();
  }, [weddingDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBankTransferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankTransfer(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBankTransfer = async () => {
    if (!weddingDetails.id) return;
    setBankLoading(true);
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('bank_transfers')
        .select('id')
        .eq('wedding_id', weddingDetails.id)
        .limit(1);

      if (fetchError) throw fetchError;
      let dbRes;

      if (existing && existing.length > 0) {
        dbRes = await supabase
          .from('bank_transfers')
          .update({
            ...{
              bank_account_holder: bankTransfer.bankAccountHolder,
              bank_number: bankTransfer.bankNumber,
              bank_branch: bankTransfer.bankBranch,
              bank_account_number: bankTransfer.bankAccountNumber,
              updated_at: new Date().toISOString(),
            }
          })
          .eq('wedding_id', weddingDetails.id);
      } else {
        dbRes = await supabase
          .from('bank_transfers')
          .insert([{
            wedding_id: weddingDetails.id,
            bank_account_holder: bankTransfer.bankAccountHolder,
            bank_number: bankTransfer.bankNumber,
            bank_branch: bankTransfer.bankBranch,
            bank_account_number: bankTransfer.bankAccountNumber,
          }]);
      }

      if (dbRes.error) throw dbRes.error;

      toast({
        title: 'הפרטים נשמרו!',
        description: 'פרטי הבנק נשמרו בהצלחה למסד נתונים.',
      });
    } catch (err: any) {
      toast({
        title: 'שגיאה בשמירת פרטי הבנק',
        description: err.message,
        variant: 'destructive',
      });
      console.error('Bank Transfer Save Error:', err);
    } finally {
      setBankLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      try {
        setImageLoading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `wedding-background-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('wedding-images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('wedding-images')
          .getPublicUrl(filePath);
        
        const updatedFormData = {
          ...formData,
          backgroundImage: urlData.publicUrl,
        };
        
        setFormData(updatedFormData);
        
        toast({
          title: 'התמונה הועלתה בהצלחה',
          description: 'התמונה תוצג כרקע בדף הראשי',
        });
        
        await onUpdate(updatedFormData);
        
      } catch (error: any) {
        toast({
          title: 'שגיאה בהעלאת התמונה',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Error uploading image:', error);
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await onUpdate(formData);
      toast({
        title: 'השינויים נשמרו בהצלחה',
        description: 'כל פרטי החתונה עודכנו בהצלחה',
      });
    } catch (error) {
      toast({
        title: 'שגיאה בשמירת השינויים',
        description: 'אנא נסה שנית',
        variant: 'destructive',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const backgroundImageStyle = {
    backgroundImage: formData.backgroundImage 
      ? `url(${formData.backgroundImage})` 
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '150px',
    borderRadius: '0.5rem',
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">עריכת פרטי החתונה</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coupleNames">שמות בני הזוג</Label>
            <Input
              id="coupleNames"
              name="coupleNames"
              dir="rtl"
              value={formData.coupleNames}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weddingDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              תאריך ושעת החתונה
            </Label>
            <Input
              id="weddingDate"
              name="weddingDate"
              type="datetime-local"
              value={formData.weddingDate ? formData.weddingDate.substring(0, 16) : ''}
              onChange={handleChange}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="backgroundImage" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              תמונת רקע
            </Label>
            
            <div style={backgroundImageStyle} className="mb-2 border border-gray-200"></div>
            
            <div className="mt-2">
              <p className="text-sm mb-2 font-medium">העלאת תמונה חדשה:</p>
              <Input
                id="backgroundImageFile"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
                disabled={imageLoading}
              />
              {imageLoading && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  מעלה תמונה...
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                *העלאת תמונה חדשה תשמר אוטומטית
              </p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm mb-2 font-medium">או הזנת כתובת URL:</p>
              <Input
                id="backgroundImageUrl"
                name="backgroundImage"
                placeholder="הזן כתובת URL של תמונת רקע"
                value={formData.backgroundImage}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="venueName">שם האולם</Label>
            <Input
              id="venueName"
              name="venueName"
              dir="rtl"
              value={formData.venueName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="venueAddress">כתובת האולם</Label>
            <Input
              id="venueAddress"
              name="venueAddress"
              dir="rtl"
              value={formData.venueAddress}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="venueMapLink">קישור ל-Google Maps</Label>
            <Input
              id="venueMapLink"
              name="venueMapLink"
              placeholder="https://maps.app.goo.gl/..."
              value={formData.venueMapLink}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wazeLink">קישור ל-Waze</Label>
            <Input
              id="wazeLink"
              name="wazeLink"
              placeholder="https://waze.com/ul?ll=..."
              value={formData.wazeLink}
              onChange={handleChange}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="bitNumber">מספר טלפון לביט</Label>
            <Input
              id="bitNumber"
              name="bitNumber"
              dir="rtl"
              placeholder="050-1234567"
              value={formData.bitNumber}
              onChange={handleChange}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-1">
            <Label className="flex items-center gap-2 text-lg font-medium mb-2">
              <Banknote className="h-4 w-4" />
              פרטי חשבון בנק להעברה (שמורים במסד נתונים)
            </Label>
            <div className="space-y-3 pl-2 border-l-2 border-gray-200 py-2">
              <div className="space-y-2">
                <Label htmlFor="bankAccountHolder">שם בעל החשבון</Label>
                <Input
                  id="bankAccountHolder"
                  name="bankAccountHolder"
                  dir="rtl"
                  value={bankTransfer.bankAccountHolder}
                  onChange={handleBankTransferChange}
                  placeholder="שם מלא של בעל החשבון"
                  disabled={bankLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankNumber">מספר בנק</Label>
                <Input
                  id="bankNumber"
                  name="bankNumber"
                  dir="rtl"
                  value={bankTransfer.bankNumber}
                  onChange={handleBankTransferChange}
                  placeholder="מספר הבנק (לדוגמה: 12)"
                  disabled={bankLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankBranch">מספר סניף</Label>
                <Input
                  id="bankBranch"
                  name="bankBranch"
                  dir="rtl"
                  value={bankTransfer.bankBranch}
                  onChange={handleBankTransferChange}
                  placeholder="מספר הסניף (לדוגמה: 645)"
                  disabled={bankLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">מספר חשבון</Label>
                <Input
                  id="bankAccountNumber"
                  name="bankAccountNumber"
                  dir="rtl"
                  value={bankTransfer.bankAccountNumber}
                  onChange={handleBankTransferChange}
                  placeholder="מספר החשבון (לדוגמה: 321151)"
                  disabled={bankLoading}
                />
              </div>
              <Button 
                className="mt-2 w-full"
                onClick={handleSaveBankTransfer}
                disabled={bankLoading}
                type="button"
              >
                {bankLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    שומר פרטי העברה...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    שמור פרטי העברה
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSave}
          disabled={saveLoading}
        >
          {saveLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              שומר שינויים...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              שמור שינויים
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
