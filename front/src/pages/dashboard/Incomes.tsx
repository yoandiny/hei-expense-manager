import React, { useState, useEffect } from "react";
import { getIncomes, deleteIncome } from "../../services/incomeService";
import IncomeForm from "../../components/forms/IncomeForm";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency"; // ✅ Import ajouté

interface Income {
  id: number;
  amount: number;
  date: string;
  source: string;
  description?: string;
  userId: number;
}

const Incomes: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const loadIncomes = async () => {
    setLoading(true);
    try {
      const data = await getIncomes();
      setIncomes(data);
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
    loadIncomes();
  }, []);

  const handleIncomeAddedOrUpdated = () => {
    loadIncomes();
    setShowForm(false);
    setEditingIncome(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await deleteIncome(id);
      loadIncomes();
      alert("✅ Income deleted!");
    } catch (err: unknown) {
      let message = "Failed to delete income.";
      if (err instanceof Error) message = err.message;
      alert(`❌ ${message}`);
    }
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setShowForm(true);
  };

  return (
      <div className="container mx-auto p-6 relative bg-green-50 min-h-screen">
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setShowForm(false)} />
      )}

      <div className={`transition-opacity duration-300 ${showForm ? "opacity-50" : "opacity-100"}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">💰 Incomes</h1>
          <button
            onClick={() => {
              setEditingIncome(null);
              setShowForm(true);
            }}
            className="bg-yellow-400 text-green-900 px-5 py-2 rounded-lg font-semibold shadow hover:bg-yellow-500 transition-colors"
          >
              + Add Income
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent"></div>
          </div>
        )}

        {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

        {incomes.length === 0 && !loading && !error && (
          <p className="text-green-700">No incomes found.</p>
        )}

        {incomes.length > 0 && (
          <div className="grid gap-4">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="bg-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-green-100 hover:shadow-lg transition"
              >
                <div>
                  <p className="text-lg font-bold text-green-800">
                    {income.source} — {formatCurrency(income.amount)} {/* ✅ Utilisation de formatCurrency */}
                  </p>
                  <p className="text-sm text-green-700">
                    Date: {formatDate(income.date)}
                  </p>
                  {income.description && (
                    <p className="text-sm text-green-700 mt-1 italic">
                      Description: {income.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-400 text-green-900 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-yellow-500 transition"
                    onClick={() => handleEdit(income)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                    onClick={() => handleDelete(income.id)}
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
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-green-200"
            onClick={(e) => e.stopPropagation()}
          >
            <IncomeForm
              onSuccess={handleIncomeAddedOrUpdated}
              onCancel={() => {
                setShowForm(false);
                setEditingIncome(null);
              }}
              initialData={editingIncome}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Incomes;