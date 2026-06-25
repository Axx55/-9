import React, { useState } from 'react';
import { MessageSquareWarning, Send, CheckCircle2 } from 'lucide-react';

export function Complaints() {
  const [submitted, setSubmitted] = useState(false);
  const [complaintType, setComplaintType] = useState('driver');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="pb-6 max-w-xl mx-auto">
      <header className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquareWarning className="text-rose-500" />
          الشكاوى والمقترحات
        </h1>
        <p className="text-sm text-slate-500 mt-2">نحن هنا للاستماع إليك وتحسين خدمتنا.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {submitted ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">تم الإرسال بنجاح!</h3>
            <p className="text-slate-500">شكراً لمشاركتك. سيقوم فريق الدعم بمراجعة طلبك والتواصل معك قريباً.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">نوع الملاحظة</label>
              <select 
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              >
                <option value="driver">شكوى بخصوص السائق</option>
                <option value="vehicle">ملاحظة على المركبة</option>
                <option value="app">مشكلة تقنية في التطبيق</option>
                <option value="suggestion">اقتراح لتطوير الخدمة</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">التفاصيل</label>
              <textarea 
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب تفاصيل ملاحظتك هنا..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
                required
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={!message.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send size={18} />
              إرسال
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
