
import { useState, useEffect } from 'react';
import { CreditCard, Banknote } from 'lucide-react';
import { useWeddingStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';

export const BitPayment = () => {
  const { weddingDetails } = useWeddingStore();
  const [bankDetails, setBankDetails] = useState({
    bankAccountHolder: '',
    bankNumber: '',
    bankBranch: '',
    bankAccountNumber: ''
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBankDetails = async () => {
      if (!weddingDetails.id) return;
      
      try {
        // First try to get from bank_transfers table
        const { data: bankData, error: bankError } = await supabase
          .from('bank_transfers')
          .select('*')
          .eq('wedding_id', weddingDetails.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (!bankError && bankData && bankData.length > 0) {
          setBankDetails({
            bankAccountHolder: bankData[0].bank_account_holder,
            bankNumber: bankData[0].bank_number,
            bankBranch: bankData[0].bank_branch,
            bankAccountNumber: bankData[0].bank_account_number
          });
        } else {
          // Fallback to wedding_events table
          setBankDetails({
            bankAccountHolder: weddingDetails.bankAccountHolder,
            bankNumber: weddingDetails.bankNumber,
            bankBranch: weddingDetails.bankBranch,
            bankAccountNumber: weddingDetails.bankAccountNumber
          });
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBankDetails();
  }, [weddingDetails.id]);
  
  // Only show if bit number or bank details exist
  if (!weddingDetails.bitNumber && !bankDetails.bankNumber) return null;
  
  const bitLink = weddingDetails.bitNumber
    ? `https://www.bitpay.co.il/app/pay?phone=${weddingDetails.bitNumber.replace(/-/g, '')}`
    : null;
  
  const payboxLink = weddingDetails.bitNumber
    ? `https://payboxapp.page.link/?link=https://paybox.com/send/${weddingDetails.bitNumber.replace(/-/g, '')}&apn=com.payboxapp&isi=1299546686&ibi=com.payboxapp`
    : null;
  
  return (
    <div className="p-8 text-center">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#1A1A2E]">לנוחיותכם, ניתן להעניק מתנות באפליקציית ביט, פייבוקס או העברה בנקאית</h3>
        {/* <p className="text-[#1A1A2E]/80">ניתן לשלוח מתנה באמצעות אפליקציית ביט או פייבוקס</p> */}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          {bitLink && (
            <a 
              href={bitLink}
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#F0B6BC] to-[#FFD1DC] text-[#1A1A2E] rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              שליחת מתנה ב-Bit
            </a>
          )}
          
          {payboxLink && (
            <a 
              href={payboxLink}
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              שליחת מתנה ב-Paybox
            </a>
          )}
        </div>
        
        {bankDetails.bankNumber && !loading && (
          <div className="bg-white/95 border border-gray-200 rounded-xl p-4 max-w-md mx-auto">
            <h4 className="text-xl font-semibold mb-3 text-[#1A1A2E]">העברה בנקאית</h4>
            <div className="space-y-2 text-[#1A1A2E]/80">
              <div className="flex justify-between">
                <span>שם בעל החשבון:</span>
                <span>{bankDetails.bankAccountHolder}</span>
              </div>
              <div className="flex justify-between">
                <span>מספר בנק:</span>
                <span>{bankDetails.bankNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>מספר סניף:</span>
                <span>{bankDetails.bankBranch}</span>
              </div>
              <div className="flex justify-between">
                <span>מספר חשבון:</span>
                <span>{bankDetails.bankAccountNumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
