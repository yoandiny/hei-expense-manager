import React, { useState } from "react";
import { createExpense } from "../../services/expenseService";
import type { CreateExpenseDTO, ExpenseTypeUI } from "../../services/expenseService";

type ExpenseFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void; // Ajout de la prop onCancel
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess, onCancel }) => {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<ExpenseTypeUI>("One-time");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Typage correct de expenseData
      const expenseData: CreateExpenseDTO = {
        amount,
        type,
        date: type === "One-time" ? date : undefined,
        startDate: type === "Recurring" ? startDate : undefined,
        endDate: type === "Recurring" && endDate ? endDate : undefined,
        categoryId: parseInt(categoryId, 10),
        description,
      };

      console.log("📤 Sending expense:", expenseData);

      await createExpense(expenseData);

      alert("✅ Expense added!");

      // Reset form
      setAmount(0);
      setDate("");
      setCategoryId("");
      setDescription("");
      setType("One-time");
      setStartDate("");
      setEndDate("");
      onSuccess?.();
    } catch (error: any) {
      console.error("❌ Erreur createExpense:", error);
      alert("❌ " + (error.message || "Failed to create expense"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : 0)}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ExpenseTypeUI)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="One-time">One-time</option>
          <option value="Recurring">Recurring</option>
        </select>
      </div>

      {type === "One-time" && (
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
      )}

      {type === "Recurring" && (
        <>
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium">Category ID</label>
        <input
          type="number"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Enter category ID"
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
          {loading ? "Saving..." : "Save Expense"}
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

export default ExpenseForm;