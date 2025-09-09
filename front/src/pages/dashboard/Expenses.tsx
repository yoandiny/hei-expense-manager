import React, { useState, useEffect } from "react";
import { getExpenses, deleteExpense } from "../../services/expenseService";
import ExpenseForm from "../../components/forms/ExpenseForm";

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
  const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire

  // Charger les dépenses au montage du composant
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await getExpenses();
        setExpenses(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Supprimer une dépense
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
      alert("✅ Expense deleted!");
    } catch (err: any) {
      alert("❌ " + (err.message || "Failed to delete expense"));
    }
  };

  // Rafraîchir la liste après ajout et masquer le formulaire
  const handleExpenseAdded = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      setShowForm(false); // Masquer le formulaire après ajout
    } catch (err: any) {
      setError(err.message || "Failed to refresh expenses");
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* Overlay sombre lorsque le formulaire est visible */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-10" />
      )}

      <div className={`transition-opacity duration-300 ${showForm ? "opacity-50" : "opacity-100"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Expense
          </button>
        </div>

        {/* Affichage des dépenses */}
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {expenses.length === 0 && !loading && !error && (
          <p className="text-gray-600">No expenses found.</p>
        )}

        {expenses.length > 0 && (
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {expense.type === "ONE_TIME" ? "One-time" : "Recurring"} - ${expense.amount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {expense.date ? new Date(expense.date).toLocaleDateString() : "N/A"}
                  </p>
                  {expense.description && (
                    <p className="text-sm text-gray-600">
                      Description: {expense.description}
                    </p>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => alert("Edit functionality not implemented yet")}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(expense.id!)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire affiché conditionnellement au-dessus de l'overlay */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="max-w-md w-full">
            <ExpenseForm
              onSuccess={handleExpenseAdded}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;