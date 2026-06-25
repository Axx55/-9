import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ArrowRight, MapPin, Plus, CheckCircle2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function NewSubscription() {
  const [step, setStep] = useState(1);
  const { user, setSubscriptions, subscriptions, workers, setWorkers } =
    useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.editId;

  const isParent = user?.accountType === "parent";
  const isEmployee = user?.accountType === "employee";
  const isInstitution = user?.accountType === "institution";

  // Form State
  const [subscriberName, setSubscriberName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [tripType, setTripType] = useState<
    "go_only" | "return_only" | "go_and_return"
  >("go_and_return");
  const [educationLevel, setEducationLevel] = useState("متوسط");
  const [region, setRegion] = useState("الرياض");
  const [neighborhood, setNeighborhood] = useState("الياسمين");
  const [schoolName, setSchoolName] = useState("مدرسة المجد");
  const [workplaceType, setWorkplaceType] = useState("مجمع");
  const [workplaceName, setWorkplaceName] = useState("مجمع الرياض بلازا");
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
  const [goTime, setGoTime] = useState("06:30");
  const [returnTime, setReturnTime] = useState("13:30");
  const [period, setPeriod] = useState("شهري");

  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerPhone, setNewWorkerPhone] = useState("");

  useEffect(() => {
    if (editId) {
      const sub = subscriptions.find((s) => s.id === editId);
      if (sub) {
        setSubscriberName(sub.subscriberName || "");
        if (sub.gender) setGender(sub.gender);
        if (sub.tripType) setTripType(sub.tripType);
        if (sub.workerIds) setSelectedWorkerIds(sub.workerIds);
        if (sub.educationLevel) setEducationLevel(sub.educationLevel);
        if (sub.schoolName) {
          if (isEmployee) setWorkplaceName(sub.schoolName);
          else setSchoolName(sub.schoolName);
        }
        if (sub.neighborhood) setNeighborhood(sub.neighborhood);
        if (sub.goTime) setGoTime(sub.goTime);
        if (sub.returnTime) setReturnTime(sub.returnTime);
        if (sub.subscriptionPeriod) setPeriod(sub.subscriptionPeriod);
      }
    }
  }, [editId]);

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName || !newWorkerPhone) return;
    const newWorker = {
      id: `w_${Date.now()}`,
      name: newWorkerName,
      phone: newWorkerPhone,
      institutionId: user?.id || "user1",
    };
    setWorkers([...workers, newWorker]);
    setSelectedWorkerIds([...selectedWorkerIds, newWorker.id]);
    setNewWorkerName("");
    setNewWorkerPhone("");
    setIsAddWorkerModalOpen(false);
  };

  const handleSubmit = () => {
    const newSub = {
      id: editId || Math.random().toString(36).substr(2, 9),
      subscriberName,
      gender,
      tripType,
      individualsCount:
        user?.accountType === "institution"
          ? selectedWorkerIds.length
          : undefined,
      workerIds:
        user?.accountType === "institution" ? selectedWorkerIds : undefined,
      educationLevel:
        user?.accountType === "parent" ? educationLevel : undefined,
      schoolName: user?.accountType === "employee" ? workplaceName : schoolName,
      neighborhood,
      goTime,
      returnTime,
      subscriptionPeriod: period,
      status: "under_review" as const,
    };

    if (editId) {
      setSubscriptions(
        subscriptions.map((s) => (s.id === editId ? { ...s, ...newSub } : s)),
      );
    } else {
      setSubscriptions([...subscriptions, newSub]);
    }
    navigate("/subscriptions");
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <header className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <Link
          to="/subscriptions"
          className="p-2 ml-4 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <ArrowRight size={20} />
        </Link>
        <h1 className="text-xl font-bold text-slate-800">
          {editId ? "تعديل طلب الاشتراك" : "طلب اشتراك جديد"}
        </h1>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto w-full">
        <div className="flex items-center px-8 py-6 bg-slate-50 border-b border-slate-200">
          <div
            className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-indigo-600" : "bg-slate-200"}`}
          ></div>
          <div className="w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm -mx-2 z-10"></div>
          <div
            className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-indigo-600" : "bg-slate-200"}`}
          ></div>
          <div
            className={`w-4 h-4 rounded-full border-4 border-white shadow-sm -mx-2 z-10 ${step >= 2 ? "bg-indigo-600" : "bg-slate-300"}`}
          ></div>
          <div
            className={`flex-1 h-1.5 rounded-full ${step >= 3 ? "bg-indigo-600" : "bg-slate-200"}`}
          ></div>
          <div
            className={`w-4 h-4 rounded-full border-4 border-white shadow-sm -mx-2 z-10 ${step >= 3 ? "bg-indigo-600" : "bg-slate-300"}`}
          ></div>
        </div>

        <div className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                معلومات المشترك
              </h2>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {isInstitution ? "اسم المؤسسة / الجهة" : "اسم المشترك"}
                </label>
                <input
                  type="text"
                  value={subscriberName}
                  onChange={(e) => setSubscriberName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white text-sm"
                  placeholder="الاسم"
                />
              </div>

              {(isParent || isEmployee) && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    النوع
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGender("male")}
                      className={`py-3 rounded-xl font-bold text-sm border transition-colors ${gender === "male" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                    >
                      ذكر
                    </button>
                    <button
                      onClick={() => setGender("female")}
                      className={`py-3 rounded-xl font-bold text-sm border transition-colors ${gender === "female" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                    >
                      أنثى
                    </button>
                  </div>
                </div>
              )}

              {isInstitution && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-700">
                      تحديد العمال المشمولين بالاشتراك
                    </label>
                    <button
                      onClick={() => setIsAddWorkerModalOpen(true)}
                      className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:text-indigo-800"
                    >
                      <Plus size={14} /> إضافة عامل جديد
                    </button>
                  </div>

                  {workers.length === 0 ? (
                    <div className="border border-slate-200 border-dashed rounded-xl p-4 text-center bg-slate-50">
                      <p className="text-slate-500 text-sm mb-2">
                        لا يوجد عمال مسجلين
                      </p>
                      <button
                        onClick={() => setIsAddWorkerModalOpen(true)}
                        className="text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        إضافة الآن
                      </button>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {workers.map((w) => {
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
                            className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${isSelected ? "bg-indigo-50/50 hover:bg-indigo-50" : "hover:bg-slate-50 bg-white"}`}
                          >
                            <div>
                              <div
                                className={`text-sm font-bold ${isSelected ? "text-indigo-700" : "text-slate-800"}`}
                              >
                                {w.name}
                              </div>
                              <div
                                className="text-xs text-slate-500 font-mono"
                                dir="ltr"
                              >
                                {w.phone}
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"}`}
                            >
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {selectedWorkerIds.length > 0 && (
                    <p className="text-xs font-bold text-indigo-600 mt-2">
                      تم تحديد {selectedWorkerIds.length} عمال
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  نوع الرحلة
                </label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white text-sm"
                >
                  <option value="go_only">ذهاب فقط</option>
                  <option value="return_only">إياب فقط</option>
                  <option value="go_and_return">ذهاب وإياب</option>
                </select>
              </div>

              {isParent && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    المرحلة الدراسية
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white text-sm"
                  >
                    <option value="ابتدائي">ابتدائي</option>
                    <option value="متوسط">متوسط</option>
                    <option value="ثانوي">ثانوي</option>
                    <option value="جامعي">جامعي</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                معلومات الوجهة
              </h2>

              {isInstitution ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      نقطة التجمع (رابط Google Maps)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                        placeholder="https://maps.google.com/..."
                        dir="ltr"
                      />
                      <button className="bg-slate-50 text-indigo-600 p-3 rounded-xl border border-slate-200 hover:bg-indigo-50 transition-colors">
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      نقطة الوجهة (رابط Google Maps)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                        placeholder="https://maps.google.com/..."
                        dir="ltr"
                      />
                      <button className="bg-slate-50 text-indigo-600 p-3 rounded-xl border border-slate-200 hover:bg-indigo-50 transition-colors">
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : isEmployee ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      نوع جهة العمل
                    </label>
                    <select
                      value={workplaceType}
                      onChange={(e) => setWorkplaceType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                    >
                      <option value="مجمع">مجمع تجاري / أعمال</option>
                      <option value="شركة">شركة</option>
                      <option value="مستشفى">مستشفى / مركز صحي</option>
                      <option value="بنك">بنك</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      المنطقة
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      الحي
                    </label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                    >
                      <option value="الياسمين">الياسمين</option>
                      <option value="الملقا">الملقا</option>
                      <option value="الصحافة">الصحافة</option>
                      <option value="العليا">العليا</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      اسم {workplaceType}
                    </label>
                    <select
                      value={workplaceName}
                      onChange={(e) => setWorkplaceName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                    >
                      {workplaceType === "مجمع" && (
                        <>
                          <option value="مجمع الرياض بلازا">
                            مجمع الرياض بلازا
                          </option>
                          <option value="مجمع العليا للأعمال">
                            مجمع العليا للأعمال
                          </option>
                        </>
                      )}
                      {workplaceType === "مستشفى" && (
                        <>
                          <option value="مستشفى الحبيب">مستشفى الحبيب</option>
                          <option value="مستشفى دلة">مستشفى دلة</option>
                        </>
                      )}
                      {workplaceType !== "مجمع" &&
                        workplaceType !== "مستشفى" && (
                          <>
                            <option value={`${workplaceType} أ`}>
                              {workplaceType} أ
                            </option>
                            <option value={`${workplaceType} ب`}>
                              {workplaceType} ب
                            </option>
                          </>
                        )}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      المنطقة
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      الحي
                    </label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                    >
                      <option value="الياسمين">الياسمين</option>
                      <option value="الملقا">الملقا</option>
                      <option value="الصحافة">الصحافة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {educationLevel === "جامعي" ? "الجامعة" : "المدرسة"}
                    </label>
                    <select
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                    >
                      <option value="مدرسة المجد">مدرسة المجد</option>
                      <option value="مدرسة الرواد">مدرسة الرواد</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                التوقيت ونوع الاشتراك
              </h2>

              {(tripType === "go_only" || tripType === "go_and_return") && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    وقت الذهاب
                  </label>
                  <input
                    type="time"
                    value={goTime}
                    onChange={(e) => setGoTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-lg font-mono font-bold"
                  />
                </div>
              )}

              {(tripType === "return_only" || tripType === "go_and_return") && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    وقت الرجوع
                  </label>
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-lg font-mono font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  نوع الاشتراك
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-sm"
                >
                  <option value="شهري">شهري</option>
                  {(isParent || isEmployee) && (
                    <option value="ترمي">ترمي</option>
                  )}
                  <option value="سنوي">سنوي</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-1/3 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
            >
              رجوع
            </button>
          )}
          <button
            onClick={() => (step < 3 ? setStep(step + 1) : handleSubmit())}
            className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-700 active:scale-[0.98] transition-all text-sm"
          >
            {step < 3 ? "التالي" : "إرسال الطلب"}
          </button>
        </div>
      </div>

      <Dialog.Root
        open={isAddWorkerModalOpen}
        onOpenChange={setIsAddWorkerModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-50">
            <Dialog.Title className="text-xl font-bold text-slate-900 mb-6 text-center">
              إضافة عامل جديد
            </Dialog.Title>

            <form onSubmit={handleAddWorker} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  اسم العامل
                </label>
                <input
                  type="text"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={newWorkerPhone}
                  onChange={(e) => setNewWorkerPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none text-left"
                  dir="ltr"
                  required
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-colors"
                >
                  حفظ وإضافة
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
