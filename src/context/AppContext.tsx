import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, DailyTrip, Subscription, Invoice, AppNotification, Worker } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  trips: DailyTrip[];
  setTrips: (trips: DailyTrip[]) => void;
  subscriptions: Subscription[];
  setSubscriptions: (subs: Subscription[]) => void;
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  notifications: AppNotification[];
  setNotifications: (notifs: AppNotification[]) => void;
  markNotificationRead: (id: string) => void;
  markAbsent: (tripId: string, count?: number, workerIds?: string[]) => void;
  undoAbsent: (tripId: string) => void;
  workers: Worker[];
  setWorkers: (workers: Worker[]) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  const [trips, setTrips] = useState<DailyTrip[]>([
    {
      id: '1',
      driverName: 'أحمد محمود',
      driverPhone: '0501234567',
      driverAvatarUrl: 'https://i.pravatar.cc/150?img=11',
      vehiclePlate: 'أ ب ج 123',
      vehicleType: 'حافلة تويوتا هايس',
      vehicleColor: 'أبيض',
      status: 'on_the_way_to_you',
      direction: 'go',
      date: new Date().toISOString(),
      subscriptionId: 's1',
    },
    {
      id: '2',
      driverName: 'خالد عبدالله',
      driverPhone: '0559876543',
      driverAvatarUrl: 'https://i.pravatar.cc/150?img=12',
      vehiclePlate: 'د ر س 987',
      vehicleType: 'حافلة كبيرة',
      vehicleColor: 'أصفر',
      status: 'arrived_at_location',
      direction: 'go',
      date: new Date().toISOString(),
      subscriptionId: 's1',
      arrivedAtTime: new Date(Date.now() - 1000 * 60 * 2).toISOString() // 2 minutes ago (represents ~50% completion)
    },
    {
      id: '3',
      driverName: 'سعيد القحطاني',
      driverPhone: '0561122334',
      driverAvatarUrl: 'https://i.pravatar.cc/150?img=13',
      vehiclePlate: 'س م و 555',
      vehicleType: 'سيارة عائلية',
      vehicleColor: 'أسود',
      status: 'not_started',
      direction: 'return',
      date: new Date().toISOString(),
      subscriptionId: 's1',
      // Note: we can interpret this as the 9:30 PM return trip
    },
    {
      id: '4',
      driverName: 'فهد المطيري',
      driverPhone: '0509988776',
      driverAvatarUrl: 'https://i.pravatar.cc/150?img=14',
      vehiclePlate: 'ط ع ن 444',
      vehicleType: 'حافلة تويوتا',
      vehicleColor: 'فضي',
      status: 'arrived',
      direction: 'go',
      date: new Date().toISOString(),
      subscriptionId: 's1'
    }
  ]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 's1',
      subscriberName: 'مؤسسة الأفق',
      gender: 'male',
      tripType: 'go_and_return',
      educationLevel: 'مؤسسة',
      schoolName: 'المركز الرئيسي',
      neighborhood: 'حي الياسمين',
      goTime: '06:30',
      returnTime: '09:30', // Displayed as 9:30 PM
      subscriptionPeriod: 'شهري',
      status: 'active',
      daysRemaining: 24,
      individualsCount: 5,
      workerIds: ['w1', 'w2', 'w3', 'w4', 'w5']
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv1',
      subscriptionId: 's1',
      invoiceNumber: 'INV-1001',
      amount: 450,
      status: 'paid',
      dueDate: new Date().toISOString()
    },
    {
      id: 'inv2',
      subscriptionId: 's2',
      invoiceNumber: 'INV-1002',
      amount: 450,
      status: 'pending',
      dueDate: new Date().toISOString()
    }
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      title: 'السائق في الطريق',
      message: 'اقترب السائق أحمد محمود من موقعك، يرجى الاستعداد.',
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'n2',
      title: 'تأكيد اشتراك جديد',
      message: 'تم استلام طلب اشتراكك الجديد بنجاح وجاري مراجعته.',
      type: 'success',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const [workers, setWorkers] = useState<Worker[]>([
    { id: 'w1', name: 'أحمد علي', phone: '0500000001', institutionId: 'user1' },
    { id: 'w2', name: 'سالم عبدالله', phone: '0500000002', institutionId: 'user1' },
    { id: 'w3', name: 'خالد محمد', phone: '0500000003', institutionId: 'user1' },
    { id: 'w4', name: 'فيصل عبدالرحمن', phone: '0500000004', institutionId: 'user1' },
    { id: 'w5', name: 'فهد عبدالعزيز', phone: '0500000005', institutionId: 'user1' },
    { id: 'w6', name: 'سعد إبراهيم', phone: '0500000006', institutionId: 'user1' },
  ]);

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAbsent = (tripId: string, count?: number, workerIds?: string[]) => {
    setTrips(trips.map(t => t.id === tripId ? { ...t, previousStatus: t.status, status: 'absent', absentCount: count, absentWorkerIds: workerIds } : t));
  };

  const undoAbsent = (tripId: string) => {
    setTrips(trips.map(t => t.id === tripId ? { ...t, status: t.previousStatus || 'not_started', absentCount: undefined, absentWorkerIds: undefined } : t));
  };

  return (
    <AppContext.Provider value={{ user, setUser, trips, setTrips, subscriptions, setSubscriptions, invoices, setInvoices, notifications, setNotifications, markNotificationRead, markAbsent, undoAbsent, workers, setWorkers }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
