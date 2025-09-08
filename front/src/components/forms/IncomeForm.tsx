import React, { useState } from "react";
import { createIncome } from "../../services/incomeService";

type IncomeFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void; // Nouvelle prop pour annuler
};

const IncomeForm: React.FC<IncomeFormProps> = ({ onSuccess, onCancel }) => {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createIncome({
        amount,
        date,
        source,
        description: description || undefined,
      });

      alert("✅ Income added!");
      setAmount(0);
      setDate("");
      setSource("");
      setDescription("");
      onSuccess?.();
    } catch (error: any) {
      console.error("Erreur:", error);
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">Add Income</h2>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="w-full border rounded-lg px-3 py-2"
          required
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
          {loading ? "Saving..." : "Save Income"}
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