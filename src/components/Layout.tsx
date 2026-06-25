import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Receipt,
  User as UserIcon,
  Bell,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  MessageSquareWarning,
  MapPin,
  Briefcase
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Logo } from "./Logo";

export function Layout() {
  const { pathname } = useLocation();
  const { user, notifications, markNotificationRead } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info size={16} className="text-blue-500" />;
      case "success":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "warning":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "error":
        return <AlertCircle size={16} className="text-rose-500" />;
      default:
        return <Bell size={16} className="text-slate-500" />;
    }
  };

  const getSubscriptionsLabel = () => {
    if (!user) return "الاشتراكات";
    switch (user.accountType) {
      case "parent":
        return "الأبناء";
      case "employee":
        return "اشتراكي";
      case "institution":
        return "الاشتراكات";
      default:
        return "الاشتراكات";
    }
  };

  const navItems = [
    { path: "/", label: user?.accountType === "institution" ? "لوحة التحكم" : "الرئيسية", icon: Home },
  ];

  if (user?.accountType === "institution") {
    navItems.push({ path: "/trips", label: "الرحلات", icon: MapPin });
    navItems.push({ path: "/subscriptions", label: "الاشتراكات", icon: Users });
    navItems.push({ path: "/workers", label: "العمال", icon: Briefcase });
  } else {
    navItems.push({ path: "/subscriptions", label: getSubscriptionsLabel(), icon: Users });
    navItems.push({ path: "/invoices", label: "الفواتير", icon: Receipt });
    navItems.push({ path: "/complaints", label: "الشكاوى", icon: MessageSquareWarning });
  }
  
  navItems.push({ path: "/profile", label: "حسابي", icon: UserIcon });

  if (!user) {
    return (
      <div className="flex h-screen bg-slate-50 justify-center">
        <main className="w-full max-w-md overflow-y-auto bg-white shadow-xl">
          <Outlet />
        </main>
      </div>
    );
  }

  // Theme colors per user type
  const getThemeClasses = () => {
    switch (user.accountType) {
      case "institution":
        return "bg-slate-900 text-slate-100 border-slate-800";
      case "parent":
        return "bg-indigo-600 text-white border-indigo-500";
      case "employee":
        return "bg-emerald-600 text-white border-emerald-500";
      case "driver":
        return "bg-amber-500 text-white border-amber-400";
      default:
        return "bg-indigo-600 text-white border-indigo-500";
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Top Header */}
      <header className={`h-16 ${themeClasses} flex items-center justify-between px-4 shrink-0 z-20 shadow-md`}>
        <div className="flex items-center gap-3">
          <Logo textClassName="text-white text-lg" iconClassName="w-8 h-8 rounded-lg bg-white/20" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-transparent"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-bold text-slate-800">الإشعارات</h3>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} جديد
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      لا توجد إشعارات حالياً
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (!notif.isRead) markNotificationRead(notif.id);
                          }}
                          className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${!notif.isRead ? "bg-slate-50/50" : ""}`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-sm mb-1 ${!notif.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
                            >
                              {notif.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-2">
                              {notif.message}
                            </p>
                            <span
                              className="text-[10px] text-slate-400 font-mono"
                              dir="ltr"
                            >
                              {new Date(notif.createdAt).toLocaleDateString(
                                "ar-SA"
                              )}{" "}
                              -{" "}
                              {new Date(notif.createdAt).toLocaleTimeString(
                                "ar-SA",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 relative">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-30 px-2 pb-safe pt-2">
        <div className="max-w-md mx-auto flex justify-between items-center px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center w-16 py-1 gap-1 relative"
              >
                {isActive && (
                  <span className={`absolute -top-2 w-8 h-1 rounded-full ${themeClasses.split(' ')[0]}`}></span>
                )}
                <Icon
                  size={22}
                  className={`transition-colors ${isActive ? themeClasses.split(' ')[0].replace('bg-', 'text-') : "text-slate-400"}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-bold transition-colors ${isActive ? themeClasses.split(' ')[0].replace('bg-', 'text-') : "text-slate-500"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
