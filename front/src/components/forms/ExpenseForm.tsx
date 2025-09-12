import React, { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../services/expenseService";
import { getCategories } from "../../services/ccategoryService";
import { uploadReceipt } from "../../services/receiptService"; 
import type { CreateExpenseDTO, ExpenseTypeUI, Expense } from "../../services/expenseService";

type ExpenseFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Expense | null;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess, onCancel, initialData }) => {
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
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(!!initialData?.id);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
        alert("Impossible de charger les catégories. Veuillez réessayer.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

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
      setAmount(0);
      setDate("");
      setCategoryId("");
      setDescription("");
      setType("One-time");
      setStartDate("");
      setEndDate("");
      setReceiptFile(null);
      setIsEditMode(false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        alert("Please select a valid category.");
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

      let expense;

      if (isEditMode && initialData?.id) {
        expense = await updateExpense(initialData.id, {
          ...expenseData,
          type: expenseData.type === "One-time" ? "ONE_TIME" : "RECURRING",
        });
        alert("✅ Expense updated!");
      } else {
        expense = await createExpense(expenseData);
        alert("✅ Expense added!");
      }

      if (receiptFile && expense?.id) {
        try {
          await uploadReceipt(expense.id, receiptFile);
          alert("✅ Receipt uploaded!");
        } catch (uploadError) {
          alert(
            "❌ Failed to upload receipt: " +
              (uploadError instanceof Error ? uploadError.message : "Unknown error")
          );
        }
      }

      if (!isEditMode) {
        setAmount(0);
        setDate("");
        setCategoryId("");
        setDescription("");
        setType("One-time");
        setStartDate("");
        setEndDate("");
        setReceiptFile(null);
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
      className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-5 border border-gray-200 dark:border-slate-600"
    >
      <h2 className="text-xl font-bold text-green-700 dark:text-green-400 text-center">
        {isEditMode ? "Modifier Dépense" : "Nouvelle Dépense"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Montant</label>
        <input
          type="number"
          value={amount || ""}
          onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : 0)}
          className="w-full border border-green-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          required
          min="0.01"
          step="0.01"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ExpenseTypeUI)}
          className="w-full border border-green-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        >
          <option value="One-time">One-time</option>
          <option value="Recurring">Recurring</option>
        </select>
      </div>

      {type === "One-time" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-green-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
        </div>
      )}

      {type === "Recurring" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-green-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">End Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-green-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Catégorie</label>
        {loadingCategories ? (
          <p className="text-gray-500 dark:text-slate-400">Chargement...</p>
        ) : (
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-green-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          >
            <option value="">-- Sélectionnez une catégorie --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-green-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="Optional"
        />
      </div>

      {/* ✅ Upload reçu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Receipt (JPG, PNG, PDF, max 5MB) — Optional
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
          className="w-full border border-green-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
        {receiptFile && (
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Selected: {receiptFile.name}
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-green-900 rounded-lg py-2 hover:bg-yellow-500 disabled:bg-gray-400 font-semibold transition shadow-sm"
        >
          {loading ? "Saving..." : isEditMode ? "Update Expense" : "Save Expense"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-slate-100 rounded-lg py-2 hover:bg-gray-400 dark:hover:bg-slate-500 font-semibold transition shadow-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;