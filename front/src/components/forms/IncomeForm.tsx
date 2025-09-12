import React, { useState, useEffect } from "react";
import { createIncome, updateIncome } from "../../services/incomeService";
import type { IncomeInput, IncomeResponse } from "../../services/incomeService";

type IncomeFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: IncomeResponse | null;
};

const IncomeForm: React.FC<IncomeFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const [amount, setAmount] = useState<number>(initialData?.amount || 0);
  const [date, setDate] = useState<string>(initialData?.date || "");
  const [source, setSource] = useState<string>(initialData?.source || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(!!initialData?.id);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setDate(initialData.date);
      setSource(initialData.source);
      setDescription(initialData.description || "");
      setIsEditMode(!!initialData.id);
    } else {
      setAmount(0);
      setDate("");
      setSource("");
      setDescription("");
      setIsEditMode(false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!amount || !date || !source) {
        alert("Amount, date, and source are required.");
        setLoading(false);
        return;
      }

      const incomeData: IncomeInput = {
        amount,
        date,
        source,
        description: description || undefined,
      };

      if (isEditMode && initialData?.id) {
        await updateIncome(initialData.id, incomeData);
        alert("✅ Income updated!");
      } else {
        await createIncome(incomeData);
        alert("✅ Income added!");
      }

      if (!isEditMode) {
        setAmount(0);
        setDate("");
        setSource("");
        setDescription("");
      }

      onSuccess?.();
    } catch (error: unknown) {
      let message = "Failed to save income.";
      if (error instanceof Error) message = error.message;
      console.error("❌ Erreur lors de la sauvegarde:", error);
      alert("❌ " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white dark:bg-slate-700 dark:border-slate-600 p-6 rounded-2xl shadow-lg space-y-5"
      >
          <h2 className="text-2xl font-bold text-green-700 dark:text-slate-100 text-center mb-4">
              {isEditMode ? "Edit Income" : "Add Income"}
          </h2>

          <div>
              <label className="block text-sm font-semibold text-green-700 dark:text-slate-400 mb-1">Amount</label>
              <input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : 0)}
                  className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  required
                  min="0.01"
                  step="0.01"
              />
          </div>

          <div>
              <label className="block text-sm font-semibold text-green-700 dark:text-slate-400 mb-1">Date</label>
              <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  required
              />
          </div>

          <div>
              <label className="block text-sm font-semibold text-green-700 dark:text-slate-400 mb-1">Source</label>
              <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  placeholder="e.g., Salary, Freelance"
                  required
              />
          </div>

          <div>
              <label className="block text-sm font-semibold text-green-700 dark:text-slate-400 mb-1">Description</label>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  placeholder="Optional"
              />
          </div>

          <div className="flex gap-4">
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-yellow-400 text-green-900  font-bold py-2 rounded-lg hover:bg-yellow-500 transition shadow-md"
              >
                  {loading ? "Saving..." : isEditMode ? "Update Income" : "Save Income"}
              </button>
              <button
                  type="button"
                  onClick={onCancel}
                  className="w-full cursor-pointer bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition shadow-sm"
              >
                  Cancel
              </button>
          </div>
      </form>

  );
};

export default IncomeForm;