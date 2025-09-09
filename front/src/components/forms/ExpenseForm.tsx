import React, { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../services/expenseService";
import type { CreateExpenseDTO, ExpenseTypeUI, Expense } from "../../services/expenseService";

type ExpenseFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Expense | null; // ✅ Pour l'édition
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess, onCancel, initialData }) => {
  // ✅ Initialisation des états avec les valeurs de initialData si présent
  const [amount, setAmount] = useState<number>(initialData?.amount || 0);
  const [date, setDate] = useState<string>(initialData?.date || "");
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.categoryId ? initialData.categoryId.toString() : ""
  );
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [type, setType] = useState<ExpenseTypeUI>(
    initialData?.type === "RECURRING" ? "Recurring" : "One-time"
  );
  const [startDate, setStartDate] = useState<string>(initialData?.startDate || "");
  const [endDate, setEndDate] = useState<string>(initialData?.endDate || "");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(!!initialData?.id); // ✅ Détection mode édition

  // ✅ Si initialData change (ex: on passe d'ajout à édition), synchroniser les états
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setDate(initialData.date || "");
      setCategoryId(initialData.categoryId.toString());
      setDescription(initialData.description || "");
      setType(initialData.type === "RECURRING" ? "Recurring" : "One-time");
      setStartDate(initialData.startDate || "");
      setEndDate(initialData.endDate || "");
      setIsEditMode(!!initialData.id);
    } else {
      // ✅ Réinitialiser si on passe en mode création
      setAmount(0);
      setDate("");
      setCategoryId("");
      setDescription("");
      setType("One-time");
      setStartDate("");
      setEndDate("");
      setIsEditMode(false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Validation côté frontend (optionnel mais utile)
      if (type === "One-time" && !date) {
        alert("Please select a date for one-time expense.");
        setLoading(false);
        return;
      }

      if (type === "Recurring" && !startDate) {
        alert("Please select a start date for recurring expense.");
        setLoading(false);
        return;
      }

      if (!categoryId || isNaN(parseInt(categoryId, 10))) {
        alert("Please enter a valid category ID.");
        setLoading(false);
        return;
      }

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

      if (isEditMode && initialData?.id) {
        // ✅ Mode édition
        await updateExpense(initialData.id, {
          ...expenseData,
          type: expenseData.type === "One-time" ? "ONE_TIME" : "RECURRING", // Conversion côté service
        });
        alert("✅ Expense updated!");
      } else {
        // ✅ Mode création
        await createExpense(expenseData);
        alert("✅ Expense added!");
      }

      // ✅ Reset seulement en mode création
      if (!isEditMode) {
        setAmount(0);
        setDate("");
        setCategoryId("");
        setDescription("");
        setType("One-time");
        setStartDate("");
        setEndDate("");
      }

      onSuccess?.();
    } catch (error: unknown) {
      let message = "Failed to save expense.";
      if (error instanceof Error) {
        message = error.message;
      }
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
        {isEditMode ? "Edit Expense" : "Add Expense"}
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
          min="1"
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
          {loading ? "Saving..." : isEditMode ? "Update Expense" : "Save Expense"}
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