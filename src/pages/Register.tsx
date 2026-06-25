import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccountType } from '../types';
import { Logo } from '../components/Logo';

export function Register() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('parent');
  const [managerId, setManagerId] = useState('');
  
  const navigate = useNavigate();
  const { setUser } = useApp();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountType === 'parent' || accountType === 'student') {
      setStep(2);
    } else {
      completeRegistration();
    }
  };

  const completeRegistration = () => {
    setUser({
      id: 'u2',
      fullName,
      phoneNumber: phone,
      accountType,
      managerId
    });
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col p-6 sm:p-10">
        <div className="flex justify-center mb-6">
          <Logo textClassName="text-2xl text-slate-900" iconClassName="w-12 h-12 rounded-xl shadow-lg shadow-indigo-200" className="flex-col gap-2" />
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-slate-800">إنشاء حساب جديد</h1>
          <Link to="/login" className="p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-full transition-colors" title="العودة">
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="flex items-center mb-8">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
          <div className="w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm -mx-2 z-10"></div>
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
          <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm -mx-2 z-10 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-5 flex-1">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">الاسم الكامل</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-slate-50 focus:bg-white text-sm" required />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم الجوال</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-left bg-slate-50 focus:bg-white text-sm font-mono" dir="ltr" placeholder="05XXXXXXXX" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-slate-50 focus:bg-white text-sm" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">تأكيد كلمة المرور</label>
              <input type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-slate-50 focus:bg-white text-sm" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">نوع الحساب</label>
              <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-slate-50 focus:bg-white text-sm">
                <option value="parent">ولي أمر</option>
                <option value="employee">موظف /ة</option>
                <option value="institution">مؤسسة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">اختيار المدير</label>
              <select value={managerId} onChange={(e) => setManagerId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-slate-50 focus:bg-white text-sm">
                <option value="">بدون مدير (مستقل)</option>
                <option value="m1">أ. خالد عبدالله</option>
                <option value="m2">أ. سعيد محمد</option>
              </select>
            </div>

            <button type="submit" className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md text-sm">
              {accountType === 'parent' ? 'التالي' : 'إكمال التسجيل'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">موقع المنزل</h2>
              <p className="text-slate-500 text-sm">قم بتحديد موقع المنزل على الخريطة لتسهيل وصول السائق</p>
            </div>

            <div className="flex-1 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[300px] mb-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
              <MapPin size={48} className="text-indigo-600 mb-4 z-10" />
              <button className="z-10 bg-white text-indigo-600 font-bold px-6 py-2 rounded-full shadow-sm text-sm border border-slate-200 hover:bg-indigo-50 transition-colors">
                فتح الخريطة (Google Maps)
              </button>
            </div>

            <div className="flex gap-4 mt-auto">
              <button onClick={() => setStep(1)} className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-sm">
                رجوع
              </button>
              <button onClick={completeRegistration} className="flex-[2] bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md text-sm">
                إكمال التسجيل
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
