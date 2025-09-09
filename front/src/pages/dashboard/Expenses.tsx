import React, { useState, useEffect } from "react";
import { getExpenses, deleteExpense } from "../../services/expenseService";
import ExpenseForm from "../../components/forms/ExpenseForm";
import { formatDate } from "../../utils/formatDate";

interface Expense {
  id?: number;
  amount: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  categoryId: number;
  description?: string;
  type: "ONE_TIME" | "RECURRING";
  createdAt?: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "NO_TOKEN") {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        if (err.message.includes("401")) {
          localStorage.removeItem("token");
          alert("Votre session a expiré. Veuillez vous reconnecter.");
          window.location.href = "/login";
          return;
        }

        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleExpenseAddedOrUpdated = () => {
    loadExpenses();
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(id);
      loadExpenses();
      alert("✅ Expense deleted!");
    } catch (err: unknown) {
      let message = "Failed to delete expense.";
      if (err instanceof Error) message = err.message;
      alert(`❌ ${message}`);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4 relative">
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setShowForm(false)} />
      )}

      <div className={`transition-opacity duration-300 ${showForm ? "opacity-50" : "opacity-100"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <button
            onClick={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Expense
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {expenses.length === 0 && !loading && !error && (
          <p className="text-gray-600">No expenses found.</p>
        )}

        {expenses.length > 0 && (
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {expense.type === "ONE_TIME" ? "One-time" : "Recurring"} — $
                    {expense.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(expense.date || expense.startDate)}
                  </p>
                  {expense.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      Description: {expense.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    onClick={() => expense.id && handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ExpenseForm
              onSuccess={handleExpenseAddedOrUpdated}
              onCancel={() => {
                setShowForm(false);
                setEditingExpense(null);
              }}
              initialData={editingExpense}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ ✅ ✅ N'OUBLIE PAS CETTE LIGNE — INDISPENSABLE ✅ ✅ ✅
export default Expenses;