import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  MapPin,
  Phone,
  Car,
  Clock,
  CheckCircle2,
  UserX,
  AlertCircle,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LiveTrackingMap } from "../components/LiveTrackingMap";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

export function Trips() {
  const { trips, markAbsent, undoAbsent, subscriptions, user, workers } =
    useApp();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [absentCount, setAbsentCount] = useState<number>(1);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
  const [isAbsentModalOpen, setIsAbsentModalOpen] = useState(false);
  const [selectedDriverTripId, setSelectedDriverTripId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "not_started":
        return {
          label: "لم تبدأ",
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: Clock,
        };
      case "journey_started":
        return {
          label: "بدأ الرحلة",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Car,
        };
      case "on_the_way":
        return {
          label: "في الطريق",
          color: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: Car,
        };
      case "on_the_way_to_you":
        return {
          label: "في الطريق إليك",
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Car,
        };
      case "arrived_at_location":
        return {
          label: "وصل الموقع",
          color: "bg-teal-50 text-teal-700 border-teal-200",
          icon: MapPin,
        };
      case "boarded":
        return {
          label: "ركب الباص",
          color: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: CheckCircle2,
        };
      case "collection_finished":
        return {
          label:
            user?.accountType === "parent"
              ? "اكتمل تجمع الطلاب"
              : "اكتمل تجمع الموظفين",
          color: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: CheckCircle2,
        };
      case "arrived":
        return {
          label: "الوصول",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
        };
      case "absent":
        return {
          label: "غياب",
          color: "bg-rose-50 text-rose-700 border-rose-200",
          icon: UserX,
        };
      default:
        return {
          label: "غير معروف",
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: Clock,
        };
    }
  };

  const handleMarkAbsentClick = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    if (user?.accountType === "institution") {
      setSelectedTripId(tripId);
      setSelectedWorkerIds(trip.absentWorkerIds || []);
      setIsAbsentModalOpen(true);
    } else {
      markAbsent(tripId);
    }
  };

  const confirmAbsence = () => {
    if (selectedTripId) {
      if (user?.accountType === "institution") {
        if (selectedWorkerIds.length > 0) {
          markAbsent(selectedTripId, selectedWorkerIds.length, selectedWorkerIds);
        } else {
          undoAbsent(selectedTripId);
        }
      } else {
        markAbsent(selectedTripId, absentCount);
      }
      setIsAbsentModalOpen(false);
      setSelectedTripId(null);
    }
  };

  return (
    <div className="pb-6">
      <header className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الرحلات اليومية</h1>
          <p className="text-sm text-slate-500 mt-1">
            رحلاتك المجدولة لهذا اليوم
          </p>
        </div>
        <Link
          to="/subscriptions/new"
          className="inline-flex items-center justify-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          طلب اشتراك جديد
        </Link>
      </header>

      {trips.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-white shadow-sm"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner text-slate-400">
            <Car size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            لا توجد رحلات اليوم
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            يبدو أنه ليس لديك أي اشتراكات فعالة حالياً. يمكنك تصفح الاشتراكات أو
            طلب اشتراك جديد لبدء رحلتك معنا.
          </p>
          <Link
            to="/subscriptions"
            className="inline-flex items-center bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl font-bold shadow-sm border border-indigo-100 hover:bg-indigo-100 transition-colors"
          >
            الذهاب للاشتراكات
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {trips.map((trip, index) => {
              const StatusIcon = getStatusDisplay(trip.status).icon;
              const isAbsent = trip.status === "absent";
              const subscription = subscriptions.find(
                (s) => s.id === trip.subscriptionId,
              );
              const destinationName =
                user?.accountType === "employee"
                  ? subscription?.schoolName || "جهة العمل"
                  : user?.accountType === "institution"
                    ? subscription?.subscriberName || "المؤسسة"
                    : subscription?.schoolName || "المدرسة";
              const isReturn = trip.direction === "return";

              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                  className={`bg-white rounded-2xl shadow-sm p-5 border transition-all hover:shadow-md ${isAbsent ? "border-rose-300 bg-rose-50/30" : "border-slate-200"}`}
                >
                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">
                      {isReturn
                        ? `رحلة العودة (إلى المنزل)`
                        : `رحلة الذهاب (إلى ${destinationName})`}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {isReturn ? `من: ${destinationName}` : "من: المنزل"}
                    </p>
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                      <div
                        className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase flex items-center w-fit gap-1.5 border ${getStatusDisplay(trip.status).color}`}
                      >
                        <StatusIcon size={14} />
                        {getStatusDisplay(trip.status).label}
                        {isAbsent &&
                          trip.absentCount &&
                          ` (${trip.absentCount} أفراد)`}
                      </div>
                      
                      {/* Show Scheduled Time for Not Started Return Trips */}
                      {isReturn && trip.status === "not_started" && subscription?.returnTime && (
                         <div className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
                           <Clock size={12} />
                           مجدولة الساعة {subscription.returnTime} مساءً
                         </div>
                      )}
                    </div>
                    {!isAbsent ? (
                      <button
                        onClick={() => handleMarkAbsentClick(trip.id)}
                        className="text-rose-600 text-xs font-bold hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                      >
                        تسجيل تغيّب
                      </button>
                    ) : (
                      <button
                        onClick={() => undoAbsent(trip.id)}
                        className="text-slate-600 text-xs font-bold hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 transition-colors bg-white shadow-sm"
                      >
                        تراجع عن الغياب
                      </button>
                    )}
                  </div>

                  {!isAbsent && (
                    <div className="mb-5 px-1">
                      <div className="flex justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold ${["not_started"].includes(trip.status) ? "text-indigo-600" : "text-slate-400"}`}
                        >
                          بدء الرحلة
                        </span>
                        <span
                          className={`text-[10px] font-bold ${["on_the_way", "on_the_way_to_you"].includes(trip.status) ? "text-indigo-600" : "text-slate-400"}`}
                        >
                          في الطريق
                        </span>
                        <span
                          className={`text-[10px] font-bold ${["arrived_at_location"].includes(trip.status) ? "text-indigo-600" : "text-slate-400"}`}
                        >
                          وصول للبيت
                        </span>
                        <span
                          className={`text-[10px] font-bold ${["boarded", "collection_finished"].includes(trip.status) ? "text-indigo-600" : "text-slate-400"}`}
                        >
                          التجمع
                        </span>
                        <span
                          className={`text-[10px] font-bold ${trip.status === "arrived" ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          الوصول
                        </span>
                      </div>
                      <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width:
                              trip.status === "arrived"
                                ? "100%"
                                : ["boarded", "collection_finished"].includes(
                                      trip.status,
                                    )
                                  ? "80%"
                                  : trip.status === "arrived_at_location"
                                    ? "60%"
                                    : trip.status === "on_the_way_to_you"
                                      ? "40%"
                                      : trip.status === "on_the_way"
                                        ? "20%"
                                        : trip.status === "journey_started"
                                          ? "10%"
                                          : "5%",
                          }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`absolute top-0 right-0 h-full rounded-full ${trip.status === "arrived" ? "bg-emerald-500" : "bg-indigo-500"}`}
                        ></motion.div>
                      </div>
                    </div>
                  )}

                  {!isAbsent &&
                    trip.status === "arrived_at_location" &&
                    trip.arrivedAtTime && (
                      <div className="mb-4 bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-800">
                          <Clock size={16} />
                          <span className="text-xs font-bold">
                            وقت الانتظار منذ الوصول:
                          </span>
                        </div>
                        <span
                          className="text-sm font-black font-mono text-amber-700 bg-amber-100 px-2 py-1 rounded"
                          dir="ltr"
                        >
                          {Math.floor(
                            (currentTime.getTime() -
                              new Date(trip.arrivedAtTime).getTime()) /
                              60000,
                          )
                            .toString()
                            .padStart(2, "0")}
                          :
                          {Math.floor(
                            ((currentTime.getTime() -
                              new Date(trip.arrivedAtTime).getTime()) %
                              60000) /
                              1000,
                          )
                            .toString()
                            .padStart(2, "0")}
                        </span>
                      </div>
                    )}

                  <div
                    onClick={() => setSelectedDriverTripId(trip.id)}
                    className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors group"
                  >
                    <div className="w-12 h-12 bg-indigo-50 rounded-full overflow-hidden border-2 border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                      {trip.driverAvatarUrl ? (
                        <img
                          src={trip.driverAvatarUrl}
                          alt={trip.driverName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Car size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">
                        كابتن: {trip.driverName}
                      </div>
                      <div
                        className="text-xs text-slate-500 font-mono flex items-center bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-200 px-2 py-1 rounded-md w-fit transition-colors"
                        dir="ltr"
                      >
                        <Phone size={12} className="mr-1.5 text-slate-400" />
                        {trip.driverPhone}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shrink-0">
                      <MessageCircle size={14} />
                    </div>
                  </div>

                  {!isAbsent &&
                    [
                      "on_the_way",
                      "on_the_way_to_you",
                      "journey_started",
                    ].includes(trip.status) && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={14} className="text-indigo-500" />
                          <span className="text-xs font-bold text-slate-600">
                            التتبع المباشر
                          </span>
                        </div>
                        <LiveTrackingMap
                          tripId={trip.id}
                          driverName={trip.driverName}
                        />
                      </div>
                    )}

                  {user?.accountType === "institution" && subscription && (
                    <div className="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                        <Users size={14} /> العمال في هذه الرحلة
                      </h4>
                      <div className="space-y-1.5">
                        {workers
                          .filter((w) => subscription.workerIds?.includes(w.id))
                          .map((w) => {
                            const isWorkerAbsent = trip.absentWorkerIds?.includes(w.id);
                            return (
                              <div key={w.id} className="flex justify-between items-center text-xs">
                                <span className={isWorkerAbsent ? "text-rose-500 line-through" : "text-slate-700 font-medium"}>
                                  {w.name}
                                </span>
                                {isWorkerAbsent && (
                                  <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                                    غائب
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        {workers.filter((w) => subscription.workerIds?.includes(w.id)).length === 0 && (
                           <div className="text-xs text-slate-400 text-center py-1">لا يوجد عمال مضافين</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full shadow-inner border border-black/10`}
                        style={{
                          backgroundColor:
                            trip.vehicleColor === "أبيض"
                              ? "#f8fafc"
                              : trip.vehicleColor === "أسود"
                                ? "#0f172a"
                                : trip.vehicleColor,
                        }}
                      ></div>
                      <div className="text-sm text-slate-700 font-bold">
                        {trip.vehicleType}
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold bg-slate-800 text-white px-3 py-1.5 rounded-lg tracking-widest shadow-inner">
                      {trip.vehiclePlate}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Absent Count Modal */}
      <Dialog.Root open={isAbsentModalOpen} onOpenChange={setIsAbsentModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 md:left-1/2 right-0 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-sm mx-auto bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-2xl z-50 animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>

            {(() => {
              const sub = subscriptions.find(
                (s) =>
                  s.id ===
                  trips.find((t) => t.id === selectedTripId)?.subscriptionId,
              );

              if (user?.accountType === "institution") {
                const subWorkers = workers.filter((w) =>
                  sub?.workerIds?.includes(w.id),
                );
                return (
                  <>
                    <Dialog.Title className="text-xl font-bold text-slate-900 mb-2 text-center">
                      تحديد المتغيبين
                    </Dialog.Title>
                    <div className="mb-8 max-h-60 overflow-y-auto space-y-2 px-2">
                      {subWorkers.map((w) => {
                        const isSelected = selectedWorkerIds.includes(w.id);
                        return (
                          <div
                            key={w.id}
                            onClick={() => {
                              setSelectedWorkerIds((prev) =>
                                isSelected
                                  ? prev.filter((id) => id !== w.id)
                                  : [...prev, w.id],
                              );
                            }}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? "border-rose-300 bg-rose-50/50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                          >
                            <div>
                              <div
                                className={`text-sm font-bold ${isSelected ? "text-rose-700" : "text-slate-800"}`}
                              >
                                {w.name}
                              </div>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center border ${isSelected ? "bg-rose-500 border-rose-600 text-white" : "border-slate-300 bg-slate-50"}`}
                            >
                              {isSelected && <CheckCircle2 size={16} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              }

              const max = sub?.individualsCount || 0;
              return (
                <>
                  <Dialog.Title className="text-xl font-bold text-slate-900 mb-2 text-center">
                    تحديد عدد المتغيبين
                  </Dialog.Title>
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          setAbsentCount(Math.max(1, absentCount - 1))
                        }
                        className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xl hover:bg-slate-200 disabled:opacity-50"
                        disabled={absentCount <= 1}
                      >
                        -
                      </button>
                      <span className="text-3xl font-black text-slate-800 w-16 text-center">
                        {absentCount}
                      </span>
                      <button
                        onClick={() =>
                          setAbsentCount(Math.min(max || 99, absentCount + 1))
                        }
                        className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xl hover:bg-slate-200 disabled:opacity-50"
                        disabled={max > 0 && absentCount >= max}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}

            <div className="flex gap-3">
              <button
                onClick={() => setIsAbsentModalOpen(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={confirmAbsence}
                className="flex-[2] py-3.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-md transition-colors"
              >
                تأكيد الغياب
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Driver Details Modal */}
      <Dialog.Root
        open={!!selectedDriverTripId}
        onOpenChange={(open) => !open && setSelectedDriverTripId(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 md:left-1/2 right-0 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-sm mx-auto bg-white rounded-t-3xl md:rounded-3xl p-0 shadow-2xl z-50 animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 overflow-hidden">
            {(() => {
              const trip = trips.find((t) => t.id === selectedDriverTripId);
              if (!trip) return null;

              return (
                <div>
                  <div className="bg-indigo-600 p-6 pt-10 text-center relative">
                    <button
                      onClick={() => setSelectedDriverTripId(null)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      ✕
                    </button>
                    <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-lg mb-3">
                      {trip.driverAvatarUrl ? (
                        <img
                          src={trip.driverAvatarUrl}
                          alt={trip.driverName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <UserX size={40} />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {trip.driverName}
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-3 mb-6">
                      <a
                        href={`tel:${trip.driverPhone}`}
                        className="flex-1 flex flex-col items-center justify-center py-3 bg-indigo-50 text-indigo-700 rounded-2xl hover:bg-indigo-100 transition-colors"
                      >
                        <Phone size={20} className="mb-1" />
                        <span className="text-xs font-bold">اتصال</span>
                      </a>
                    </div>
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
