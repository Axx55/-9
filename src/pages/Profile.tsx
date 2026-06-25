import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Phone, Lock, LogOut, Shield, ChevronLeft, Star } from 'lucide-react';

export function Profile() {
  const { user, setUser, subscriptions } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const hasActiveSubscriptions = subscriptions.length > 0;

  if (!user) return null;

  const getAccountTypeName = (type: string) => {
    switch(type) {
      case 'parent': return 'ولي أمر';
      case 'employee': return 'موظف /ة';
      case 'institution': return 'مؤسسة';
      case 'student': return 'طالب / طالبة';
      default: return type;
    }
  };

  return (
    <div className="pb-6">
      <header className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">حسابي</h1>
          <p className="text-sm text-slate-500 mt-1">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
        </div>
        <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase shadow-sm">
          {getAccountTypeName(user.accountType)}
        </span>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center border-4 border-slate-50 shadow-inner overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <User size={36} className="text-indigo-300" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-indigo-700 transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{user.fullName}</h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-md w-fit" dir="ltr">{user.phoneNumber}</div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-700">4.8</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className={star <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 divide-y divide-slate-100">
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <User size={20} />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900 mb-0.5">الاسم الكامل</span>
              <span className="block text-xs text-slate-500">{user.fullName}</span>
            </div>
          </div>
          <ChevronLeft size={20} className="text-slate-400" />
        </div>

        <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <Phone size={20} />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900 mb-0.5">رقم الجوال</span>
              <span className="block text-xs text-slate-500 font-mono" dir="ltr">{user.phoneNumber}</span>
            </div>
          </div>
          <ChevronLeft size={20} className="text-slate-400" />
        </div>

        <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <Lock size={20} />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900 mb-0.5">كلمة المرور</span>
              <span className="block text-xs text-slate-500">تغيير كلمة المرور الخاصة بك</span>
            </div>
          </div>
          <ChevronLeft size={20} className="text-slate-400" />
        </div>

        <div className={`p-4 flex items-center justify-between ${hasActiveSubscriptions ? 'opacity-50' : 'hover:bg-slate-50 cursor-pointer'} transition-colors`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <Shield size={20} />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900 mb-0.5">تغيير نوع الحساب</span>
              <span className="block text-xs text-slate-500">
                {hasActiveSubscriptions ? 'لا يمكن التغيير لوجود اشتراكات نشطة' : 'ترقية أو تغيير نوع حسابك الحالي'}
              </span>
            </div>
          </div>
          {!hasActiveSubscriptions && <ChevronLeft size={20} className="text-slate-400" />}
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full md:w-auto md:px-8 bg-rose-50 border border-rose-200 text-rose-700 font-bold py-3.5 rounded-xl shadow-sm hover:bg-rose-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
      >
        <LogOut size={18} />
        تسجيل الخروج
      </button>

    </div>
  );
}
