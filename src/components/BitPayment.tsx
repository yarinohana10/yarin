
import { CreditCard, Banknote } from 'lucide-react';
import { useWeddingStore } from '@/lib/store';

export const BitPayment = () => {
  const { weddingDetails } = useWeddingStore();
  
  // Only show if bit number or bank details exist
  if (!weddingDetails.bitNumber && !weddingDetails.bankNumber) return null;
  
  const bitLink = weddingDetails.bitNumber
    ? `https://www.bitpay.co.il/app/pay?phone=${weddingDetails.bitNumber.replace(/-/g, '')}`
    : null;
  
  const payboxLink = weddingDetails.bitNumber
    ? `https://payboxapp.page.link/?link=https://paybox.com/send/${weddingDetails.bitNumber.replace(/-/g, '')}&apn=com.payboxapp&isi=1299546686&ibi=com.payboxapp`
    : null;
  
  return (
    <div className="p-8 text-center">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-[#1A1A2E]">שלחו מתנה לזוג</h3>
        <p className="text-[#1A1A2E]/80">ניתן לשלוח מתנה באמצעות אפליקציית ביט או פייבוקס</p>
        
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
        
        {weddingDetails.bankNumber && (
          <div className="bg-white/95 border border-gray-200 rounded-xl p-4 max-w-md mx-auto">
            <h4 className="text-xl font-semibold mb-3 text-[#1A1A2E]">העברה בנקאית</h4>
            <div className="space-y-2 text-[#1A1A2E]/80">
              <div className="flex justify-between">
                <span>שם בעל החשבון:</span>
                <span>{weddingDetails.bankAccountHolder}</span>
              </div>
              <div className="flex justify-between">
                <span>מספר בנק:</span>
                <span>{weddingDetails.bankNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>מספר סניף:</span>
                <span>{weddingDetails.bankBranch}</span>
              </div>
              <div className="flex justify-between">
                <span>מספר חשבון:</span>
                <span>{weddingDetails.bankAccountNumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
