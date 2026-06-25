import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, Bus, MapPin, Activity, 
  TrendingUp, TrendingDown, Clock, ShieldCheck
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';

const tripsData = [
  { name: 'الأحد', trips: 12, absents: 2 },
  { name: 'الإثنين', trips: 14, absents: 1 },
  { name: 'الثلاثاء', trips: 15, absents: 0 },
  { name: 'الأربعاء', trips: 13, absents: 4 },
  { name: 'الخميس', trips: 16, absents: 1 },
];

const departmentData = [
  { name: 'المالية', value: 35 },
  { name: 'التسويق', value: 25 },
  { name: 'تقنية المعلومات', value: 20 },
  { name: 'الموارد البشرية', value: 15 },
  { name: 'الإدارة', value: 5 },
];
const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#64748b'];

export function InstitutionDashboard() {
  const { workers, subscriptions, trips } = useApp();

  const totalWorkers = workers.length;
  const activeSubs = subscriptions.filter(s => s.status === 'active').length;
  const completedTrips = trips.filter(t => t.status === 'arrived').length;
  
  return (
    <div className="pb-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">لوحة تحكم المؤسسة</h1>
        <p className="text-slate-500 mt-2 font-medium">مرحباً بك، إليك نظرة عامة على نشاط اليوم</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users size={20} />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp size={12} className="ml-1" /> +12%
            </span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">إجمالي الموظفين</h3>
            <p className="text-2xl font-black text-slate-800">{totalWorkers}</p>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp size={12} className="ml-1" /> +5%
            </span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">الاشتراكات الفعالة</h3>
            <p className="text-2xl font-black text-slate-800">{activeSubs}</p>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Bus size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">الرحلات المكتملة (اليوم)</h3>
            <p className="text-2xl font-black text-slate-800">{completedTrips}</p>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Activity size={20} />
            </div>
            <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
              <TrendingDown size={12} className="ml-1" /> -2%
            </span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">معدل الغياب</h3>
            <p className="text-2xl font-black text-slate-800">4.2%</p>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} transition={{delay: 0.4}} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">نشاط الرحلات الأسبوعي</h3>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tripsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{color: '#1e293b', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="trips" name="عدد الرحلات" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTrips)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} transition={{delay: 0.5}} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">توزيع الموظفين (الأقسام)</h3>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {departmentData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs text-slate-600">
                <span className="w-3 h-3 rounded-full ml-1" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
