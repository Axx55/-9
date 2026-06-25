import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Receipt, CheckCircle, Upload, Copy, AlertCircle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export function Invoices() {
  const { invoices, setInvoices } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'paid'>('pending');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const pendingInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'under_review');
  const paidInvoices = invoices.filter(i => i.status === 'paid');

  const displayInvoices = activeTab === 'pending' ? pendingInvoices : paidInvoices;

  const handlePayClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsPaymentModalOpen(true);
  };

  const confirmPayment = () => {
    if (selectedInvoiceId) {
      setInvoices(invoices.map(inv => 
        inv.id === selectedInvoiceId ? { ...inv, status: 'under_review' } : inv
      ));
    }
    setIsPaymentModalOpen(false);
    setSelectedInvoiceId(null);
  };

  return (
    <div className="pb-6">
      <header className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الفواتير</h1>
          <p className="text-sm text-slate-500 mt-1">تتبع وتسديد فواتير اشتراكاتك</p>
        </div>
      </header>

      {/* Custom Tabs */}
      <div className="flex bg-slate-200 p-1.5 rounded-xl mb-6 max-w-sm">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          فواتير معلّقة
          {pendingInvoices.length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs bg-rose-100 text-rose-600 rounded-full">
              {pendingInvoices.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'paid' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          فواتير مسدّدة
        </button>
      </div>

      {displayInvoices.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center bg-white rounded-2xl border-2 border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Receipt size={40} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-bold text-lg">لا توجد فواتير {activeTab === 'pending' ? 'معلّقة' : 'مسدّدة'} حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayInvoices.map(invoice => (
            <div key={invoice.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 mb-1 block tracking-widest uppercase">رقم الطلب</span>
                  <h3 className="font-mono font-bold text-slate-800 text-base">{invoice.invoiceNumber}</h3>
                </div>
                <div className="text-left bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-400 mb-1 block">المبلغ المستحق</span>
                  <div className="text-base font-black text-indigo-700 flex items-center justify-end gap-1.5">
                    {invoice.amount} <span className="text-xs font-bold text-indigo-500">ريال</span>
                  </div>
                </div>
              </div>

              {invoice.status === 'under_review' && (
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-xs font-bold mb-4 border border-amber-200">
                  <AlertCircle size={16} />
                  الفاتورة قيد المراجعة من الإدارة
                </div>
              )}
              
              {invoice.status === 'paid' && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-xs font-bold mb-4 border border-emerald-200">
                  <CheckCircle size={16} />
                  تم السداد بنجاح
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <span className="font-bold text-slate-400">تاريخ الإصدار:</span>
                  <span dir="ltr" className="font-bold text-slate-700">{new Date(invoice.dueDate).toLocaleDateString('ar-SA')}</span>
                </div>
                {invoice.status === 'pending' && (
                  <button 
                    onClick={() => handlePayClick(invoice.id)}
                    className="bg-indigo-600 text-white font-bold px-5 py-2 rounded-lg text-xs hover:bg-indigo-700 active:scale-[0.98] shadow-sm transition-all"
                  >
                    دفع الفاتورة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog.Root open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 md:left-1/2 right-0 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-md md:max-w-lg mx-auto bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-8 shadow-2xl z-50 animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>
            
            <Dialog.Title className="text-2xl font-bold text-slate-900 mb-6 text-center">
              تفاصيل الدفع
            </Dialog.Title>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اختر البنك</label>
                <select className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-slate-50 focus:bg-white text-sm font-medium">
                  <option value="rajhi">مصرف الراجحي</option>
                  <option value="alahli">البنك الأهلي</option>
                  <option value="inma">مصرف الإنماء</option>
                </select>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-inner">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                  <span className="text-sm font-bold text-slate-500">اسم الحساب</span>
                  <span className="font-bold text-slate-900 text-base">مؤسسة النقل السريع</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-500 block mb-2">رقم الآيبان (IBAN)</span>
                  <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-mono font-bold text-slate-800 text-sm tracking-widest" dir="ltr">
                      SA98 8000 0000 1234 5678 90
                    </span>
                    <button className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Copy size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">إيصال التحويل</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <Upload size={32} className="mx-auto mb-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">اضغط لرفع صورة الإيصال</span>
                  <p className="text-xs text-slate-400 mt-2 font-medium">صيغة JPG أو PNG</p>
                </div>
              </div>

              <button 
                onClick={confirmPayment}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-indigo-700 active:scale-[0.98] transition-all text-sm"
              >
                تأكيد الدفع وإرسال الإيصال
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
