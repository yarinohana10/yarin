
import { CreditCard } from 'lucide-react';
import { useWeddingStore } from '@/lib/store';

export const BitPayment = () => {
  const { weddingDetails } = useWeddingStore();
  
  if (!weddingDetails.bitNumber) return null;
  
  // Clean phone number (remove hyphens if any)
  const cleanPhone = weddingDetails.bitNumber.replace(/-/g, '');
  
  const bitLink = `https://www.bitpay.co.il/app/pay?phone=${cleanPhone}`;
  const payboxLink = `https://payboxapp.page.link/?link=https://paybox.com/send/${cleanPhone}&apn=com.payboxapp&isi=1299546686&ibi=com.payboxapp`;
  
  return (
    <div className="p-8 text-center">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-[#1A1A2E]">שלחו מתנה לזוג</h3>
        <p className="text-[#1A1A2E]/80">ניתן לשלוח מתנה באמצעות אפליקציית ביט או פייבוקס</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={bitLink}
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#F0B6BC] to-[#FFD1DC] text-[#1A1A2E] rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            שליחת מתנה ב-Bit
          </a>
          
          <a 
            href={payboxLink}
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            שליחת מתנה ב-Paybox
          </a>
        </div>
      </div>
    </div>
  );
};
