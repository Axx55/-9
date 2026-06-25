import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';

export function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setUser({
      id: 'u1',
      fullName: 'أبو بكر',
      phoneNumber: phone,
      accountType: 'parent'
    });
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col p-6 sm:p-10">
        <div className="flex justify-center mb-6">
          <Logo textClassName="text-2xl text-slate-900" iconClassName="w-16 h-16 rounded-2xl shadow-lg shadow-indigo-200" className="flex-col gap-4" />
        </div>
        <p className="text-slate-500 text-center mb-8 text-sm">مرحباً بك، قم بتسجيل الدخول للمتابعة</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم الجوال</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-left bg-slate-50 focus:bg-white text-sm font-mono"
              dir="ltr"
              placeholder="05XXXXXXXX"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white text-sm"
              required
            />
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">نسيت كلمة المرور؟</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md text-sm mt-2"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="text-center mt-8 border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-600">
            ليس لديك حساب؟ <Link to="/register" className="text-indigo-600 font-bold hover:underline transition-all">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
