import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Calendar,
  History,
  BarChart3,
  Users,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function Subscriptions() {
  const { user, subscriptions, workers, setSubscriptions } = useApp();
  const [selectedHistorySubId, setSelectedHistorySubId] = useState<
    string | null
  >(null);
  const [selectedDetailsSubId, setSelectedDetailsSubId] = useState<
    string | null
  >(null);

  const [swapWorkerModalOpen, setSwapWorkerModalOpen] = useState(false);
  const [workerToReplaceId, setWorkerToReplaceId] = useState<string | null>(
    null,
  );
  const [workerToAddId, setWorkerToAddId] = useState<string | null>(null);

  const getTitle = () => {
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "under_review":
        return {
          label: "تحت المراجعة",
          color: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "accepted_pending_payment":
        return {
          label: "مقبول (بانتظار الدفع)",
          color: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "active":
        return {
          label: "فعّال",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "expired":
        return {
          label: "منتهي",
          color: "bg-rose-50 text-rose-700 border-rose-200",
        };
      default:
        return {
          label: status,
          color: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  const handleSwapWorker = () => {
    if (!workerToReplaceId || !workerToAddId || !selectedDetailsSubId) return;

    setSubscriptions(
      subscriptions.map((sub) => {
        if (sub.id === selectedDetailsSubId) {
          const newWorkerIds =
            sub.workerIds?.filter((id) => id !== workerToReplaceId) || [];
          newWorkerIds.push(workerToAddId);
          return { ...sub, workerIds: newWorkerIds };
        }
        return sub;
      }),
    );

    setSwapWorkerModalOpen(false);
    setWorkerToReplaceId(null);
    setWorkerToAddId(null);
  };

  return (
    <div className="pb-6 relative min-h-full">
      <header className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{getTitle()}</h1>
          <p className="text-sm text-slate-500 mt-1">
            إدارة اشتراكاتك الحالية والسابقة
          </p>
        </div>
        <Link
          to="/subscriptions/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          إضافة اشتراك جديد
        </Link>
      </header>

      {subscriptions.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center mt-8 bg-white shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner text-slate-400">
            <Plus size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            لا توجد اشتراكات
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            ابدأ بإضافة أول اشتراك لك لتتمكن من استخدام الخدمة والاستفادة من
            رحلاتنا.
          </p>
          <Link
            to="/subscriptions/new"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors"
          >
            إضافة اشتراك جديد
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-r-4 border-r-slate-400 relative hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    {sub.subscriberName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {sub.subscriptionPeriod} •{" "}
                    {sub.tripType === "go_and_return"
                      ? "ذهاب وإياب"
                      : "اتجاه واحد"}
                    {sub.individualsCount && ` • ${sub.individualsCount} فرد`}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${getStatusInfo(sub.status).color}`}
                >
                  {getStatusInfo(sub.status).label}
                </span>
              </div>

              <div className="space-y-2 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span className="font-bold text-slate-700">
                    {sub.schoolName}{" "}
                    <span className="text-slate-400 font-medium">
                      ({sub.neighborhood})
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Clock size={14} />
                  </div>
                  <span className="font-bold text-slate-700 font-mono">
                    <span dir="ltr">{sub.goTime}</span> -{" "}
                    <span dir="ltr">{sub.returnTime}</span>
                  </span>
                </div>
              </div>

              {sub.status === "under_review" && (
                <div className="flex gap-3 border-t border-slate-100 pt-4 mt-2">
                  <Link
                    to="/subscriptions/new"
                    state={{ editId: sub.id }}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2 shadow-sm"
                  >
                    <Edit2 size={16} /> تعديل
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
                        setSubscriptions(
                          subscriptions.filter((s) => s.id !== sub.id),
                        );
                      }
                    }}
                    className="bg-rose-50 text-rose-600 px-4 py-2 rounded-lg hover:bg-rose-100 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              {sub.status === "accepted_pending_payment" && (
                <Link
                  to="/invoices"
                  className="block w-full bg-indigo-600 text-white text-center py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors mt-2 shadow-sm"
                >
                  الذهاب للدفع
                </Link>
              )}

              {sub.status === "active" && sub.daysRemaining !== undefined && (
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      الأيام المتبقية
                    </span>
                    <div className="flex items-center gap-1.5 text-indigo-700 font-mono font-bold bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 shadow-inner">
                      <Calendar size={14} />
                      <span>{sub.daysRemaining} يوم</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedHistorySubId(sub.id)}
                      className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <History size={16} /> سجل الرحلات
                    </button>
                    {user?.accountType === "institution" && (
                      <button
                        onClick={() => setSelectedDetailsSubId(sub.id)}
                        className="flex-1 bg-indigo-50 text-indigo-700 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 shadow-sm border border-indigo-100"
                      >
                        <Users size={16} /> تفاصيل العمال
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Details & Swap Modal */}
      <Dialog.Root
        open={!!selectedDetailsSubId}
        onOpenChange={(open) => !open && setSelectedDetailsSubId(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 md:left-1/2 right-0 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-md mx-auto bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-2xl z-50 animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            {(() => {
              const sub = subscriptions.find(
                (s) => s.id === selectedDetailsSubId,
              );
              if (!sub) return null;

              const subWorkers = workers.filter((w) =>
                sub.workerIds?.includes(w.id),
              );

              return (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">
                        تفاصيل العمال المشتركين
                      </h2>
                      <p className="text-sm text-slate-500">
                        إدارة عمال الاشتراك وتبديلهم
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDetailsSubId(null)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {subWorkers.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <div>
                          <div className="font-bold text-slate-800 text-sm mb-1">
                            {w.name}
                          </div>
                          <div
                            className="text-xs text-slate-500 font-mono"
                            dir="ltr"
                          >
                            {w.phone}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setWorkerToReplaceId(w.id);
                            setSwapWorkerModalOpen(true);
                          }}
                          className="bg-white border border-slate-200 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-50 transition-colors shadow-sm"
                        >
                          <RefreshCw size={14} /> تبديل
                        </button>
                      </div>
                    ))}
                    {subWorkers.length === 0 && (
                      <div className="text-center text-slate-500 text-sm py-4">
                        لا يوجد عمال مضافين
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedDetailsSubId(null)}
                      className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              );
            })()}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Swap Selection Modal */}
      <Dialog.Root
        open={swapWorkerModalOpen}
        onOpenChange={setSwapWorkerModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-[60]">
            <Dialog.Title className="text-lg font-bold text-slate-900 mb-2 text-center">
              اختيار عامل بديل
            </Dialog.Title>
            <Dialog.Description className="text-sm text-slate-500 mb-6 text-center">
              اختر عاملاً من القائمة ليحل محل العامل المحدد
            </Dialog.Description>

            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {workers
                .filter((w) => {
                  const sub = subscriptions.find(
                    (s) => s.id === selectedDetailsSubId,
                  );
                  return !sub?.workerIds?.includes(w.id);
                })
                .map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setWorkerToAddId(w.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${workerToAddId === w.id ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  >
                    <span
                      className={`text-sm font-bold ${workerToAddId === w.id ? "text-indigo-700" : "text-slate-800"}`}
                    >
                      {w.name}
                    </span>
                    {workerToAddId === w.id && (
                      <CheckCircle2 size={16} className="text-indigo-600" />
                    )}
                  </div>
                ))}
              {workers.filter((w) => {
                const sub = subscriptions.find(
                  (s) => s.id === selectedDetailsSubId,
                );
                return !sub?.workerIds?.includes(w.id);
              }).length === 0 && (
                <div className="text-center text-slate-500 text-sm py-4">
                  لا يوجد عمال إضافيين متاحين للتبديل
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSwapWorkerModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSwapWorker}
                disabled={!workerToAddId}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                تأكيد التبديل
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Trip History Modal */}
      <Dialog.Root
        open={!!selectedHistorySubId}
        onOpenChange={(open) => !open && setSelectedHistorySubId(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 md:left-1/2 right-0 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-md mx-auto bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-2xl z-50 animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>

            {(() => {
              const sub = subscriptions.find(
                (s) => s.id === selectedHistorySubId,
              );
              if (!sub) return null;

              // Mock statistics data
              const stats = {
                daysRidden: 45,
                absences: 3,
                avgBoardTime: "2.5 دقائق",
                avgDestTime: "35 دقيقة",
              };

              return (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <History className="text-indigo-600" />
                        سجل رحلات {sub.subscriberName}
                      </h2>
                      <p className="text-sm text-slate-500">
                        إحصائيات الاشتراك الحالي
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedHistorySubId(null)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-slate-500 text-xs font-bold mb-1 flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-indigo-500" /> عدد
                        أيام الركوب
                      </div>
                      <div
                        className="text-2xl font-black text-slate-800"
                        dir="ltr"
                      >
                        {stats.daysRidden}
                      </div>
                    </div>

                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                      <div className="text-rose-600 text-xs font-bold mb-1 flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-rose-500" /> عدد
                        الغيابات
                      </div>
                      <div
                        className="text-2xl font-black text-rose-700"
                        dir="ltr"
                      >
                        {stats.absences}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-slate-500 text-xs font-bold mb-1 flex items-center gap-1.5">
                        <Clock size={14} className="text-amber-500" /> متوسط وقت
                        الركوب
                      </div>
                      <div
                        className="text-xl font-black text-slate-800"
                        dir="ltr"
                      >
                        {stats.avgBoardTime}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-slate-500 text-xs font-bold mb-1 flex items-center gap-1.5">
                        <MapPin size={14} className="text-emerald-500" /> متوسط
                        وقت الوصول
                      </div>
                      <div
                        className="text-xl font-black text-slate-800"
                        dir="ltr"
                      >
                        {stats.avgDestTime}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedHistorySubId(null)}
                      className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              );
            })()}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
