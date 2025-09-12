import React, { useState, useEffect } from "react";
import { getExpenses, deleteExpense } from "../../services/expenseService";
import ExpenseForm from "../../components/forms/ExpenseForm";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { downloadReceipt, getReceiptViewUrl } from "../../services/receiptService";
import { ToastContainer, toast } from "react-toastify"; // ✅ Importé
import "react-toastify/dist/ReactToastify.css"; // ✅ CSS importé

interface Expense {
  id?: number;
  amount: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  categoryId: number;
  description?: string;
  type: "ONE_TIME" | "RECURRING";
  receiptPath?: string;
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
          toast.error("Votre session a expiré. Veuillez vous reconnecter.", { // ✅ Remplacé alert par toast
            position: "top-center",
            autoClose: 3000,
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
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
    toast.success("✅ Dépense sauvegardée !", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(id);
      loadExpenses();
      toast.success("✅ Dépense supprimée !", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err: unknown) {
      let message = "Failed to delete expense.";
      if (err instanceof Error) message = err.message;
      toast.error(`❌ ${message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

    return (
        <div className="container mx-auto p-6 relative bg-gray-50 min-h-screen">
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setShowForm(false)} />
            )}

            <div className={`transition-opacity duration-300 ${showForm ? "opacity-50" : "opacity-100"}`}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">💸 Expenses</h1>
                    <button
                        onClick={() => {
                            setEditingExpense(null);
                            setShowForm(true);
                        }}
                        className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition-colors"
                    >
                        + Add Expense
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                )}

                {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

                {expenses.length === 0 && !loading && !error && (
                    <p className="text-gray-700">No expenses found.</p>
                )}

                {expenses.length > 0 && (
                    <div className="grid gap-4">
                        {expenses.map((expense) => (
                            <div
                                key={expense.id}
                                className="bg-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-200 hover:shadow-lg transition"
                            >
                                <div>
                                    <p className="text-lg font-bold text-gray-800">
                                        {expense.type === "ONE_TIME" ? "One-time" : "Recurring"} —{" "}
                                        {formatCurrency(expense.amount)}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {expense.type === "ONE_TIME" ? (
                                            <>Date: {formatDate(expense.date)}</>
                                        ) : (
                                            <>
                                                Période: du {formatDate(expense.startDate)}{" "}
                                                {expense.endDate ? `au ${formatDate(expense.endDate)}` : "(sans fin)"}
                                            </>
                                        )}
                                    </p>
                                    {expense.description && (
                                        <p className="text-sm text-gray-700 mt-1 italic">
                                            Description: {expense.description}
                                        </p>
                                    )}
                                    {expense.receiptPath && (
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            <a
                                                href={getReceiptViewUrl(expense.id!)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 font-medium hover:underline text-sm"
                                            >
                                                👁️ View Receipt
                                            </a>
                                            <button
                                                onClick={() => expense.id && downloadReceipt(expense.id)}
                                                className="text-gray-700 font-medium hover:underline text-sm"
                                            >
                                                📥 Download
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-amber-400 text-gray-900 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-500 transition"
                                        onClick={() => handleEdit(expense)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
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
                        className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200"
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

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );

};

export default Expenses;