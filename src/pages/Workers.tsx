import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function Workers() {
  const { workers, setWorkers, subscriptions, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const openAddModal = () => {
    setEditingWorkerId(null);
    setName("");
    setPhone("");
    setIsModalOpen(true);
  };

  const openEditModal = (worker: any) => {
    setEditingWorkerId(worker.id);
    setName(worker.name);
    setPhone(worker.phone);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العامل؟")) {
      setWorkers(workers.filter((w) => w.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingWorkerId) {
      setWorkers(
        workers.map((w) =>
          w.id === editingWorkerId ? { ...w, name, phone } : w,
        ),
      );
    } else {
      const newWorker = {
        id: `w_${Date.now()}`,
        name,
        phone,
        institutionId: user?.id || "user1",
      };
      setWorkers([...workers, newWorker]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="pb-6">
      <header className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" /> إدارة العمال
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            إضافة وتعديل بيانات العمال التابعين للمؤسسة
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 justify-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> إضافة عامل
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => {
          const sub = subscriptions.find((s) =>
            s.workerIds?.includes(worker.id),
          );
          return (
            <div
              key={worker.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">
                  {worker.name}
                </h3>
                <div
                  className="text-sm font-mono text-slate-500 mb-4 bg-slate-50 px-2 py-1 rounded w-fit"
                  dir="ltr"
                >
                  {worker.phone}
                </div>
                <div
                  className={`text-xs font-bold px-2.5 py-1 rounded-md w-fit border ${sub ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}
                >
                  {sub ? "مشترك" : "غير مشترك"}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(worker)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(worker.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {workers.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-white shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              لا يوجد عمال
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              قم بإضافة عمال لتمكين إضافتهم في الاشتراكات.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              <Plus size={18} /> إضافة عامل
            </button>
          </div>
        )}
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-50">
            <Dialog.Title className="text-xl font-bold text-slate-900 mb-6 text-center">
              {editingWorkerId ? "تعديل بيانات عامل" : "إضافة عامل جديد"}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  اسم العامل
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none text-left"
                  dir="ltr"
                  required
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-colors"
                >
                  حفظ
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
