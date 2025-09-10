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
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {isEditMode ? "Edit Income" : "Add Income"}
      </h2>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount || ""}
          onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : 0)}
          className="w-full border rounded-lg px-3 py-2"
          required
          min="0.01"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Source</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="e.g., Salary, Freelance"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Optional"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : isEditMode ? "Update Income" : "Save Income"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-300 text-gray-800 rounded-lg py-2 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;