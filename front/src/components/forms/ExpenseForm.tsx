import React, { useState, useEffect } from "react";
import { createExpense, updateExpense } from "../../services/expenseService";
import { getCategories } from "../../services/ccategoryService";
import { uploadReceipt } from "../../services/receiptService"; // ✅ Import du service reçu
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
  const [receiptFile, setReceiptFile] = useState<File | null>(null); // ✅ État pour le fichier
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
      // On ne réinitialise pas receiptFile — l'utilisateur peut en uploader un nouveau
    } else {
      setAmount(0);
      setDate("");
      setCategoryId("");
      setDescription("");
      setType("One-time");
      setStartDate("");
      setEndDate("");
      setReceiptFile(null); // ✅ Réinitialise le fichier
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

      // ✅ Upload du reçu si un fichier est sélectionné
      if (receiptFile && expense?.id) {
        try {
          await uploadReceipt(expense.id, receiptFile);
          alert("✅ Receipt uploaded!");
        } catch (uploadError) {
          alert("❌ Failed to upload receipt: " + (uploadError instanceof Error ? uploadError.message : "Unknown error"));
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
        <label className="block text-sm font-medium">Category</label>
        {loadingCategories ? (
          <p className="text-gray-500">Chargement...</p>
        ) : (
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
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
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Optional"
        />
      </div>

      {/* ✅ Champ d'upload de reçu */}
      <div>
        <label className="block text-sm font-medium">
          Receipt (JPG, PNG, PDF, max 5MB) — Optional
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
          className="w-full border rounded-lg px-3 py-2"
        />
        {receiptFile && (
          <p className="text-sm text-gray-600 mt-1">Selected: {receiptFile.name}</p>
        )}
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