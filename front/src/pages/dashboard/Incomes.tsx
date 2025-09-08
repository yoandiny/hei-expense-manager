import React, { useState, useEffect } from "react";
import { getIncomes, deleteIncome } from "../../services/incomeService";
import IncomeForm from "../../components/forms/IncomeForm";

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
  const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire

  // Charger les revenus au montage du composant
  useEffect(() => {
    const fetchIncomes = async () => {
      setLoading(true);
      try {
        const data = await getIncomes();
        setIncomes(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch incomes");
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  // Supprimer un revenu
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await deleteIncome(id);
      setIncomes(incomes.filter((income) => income.id !== id));
      alert("✅ Income deleted!");
    } catch (err: any) {
      alert("❌ " + (err.message || "Failed to delete income"));
    }
  };

  // Rafraîchir la liste après ajout et masquer le formulaire
  const handleIncomeAdded = async () => {
    try {
      const data = await getIncomes();
      setIncomes(data);
      setShowForm(false); // Masquer le formulaire après ajout
    } catch (err: any) {
      setError(err.message || "Failed to refresh incomes");
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* Overlay sombre lorsque le formulaire est visible */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 z-10" />
      )}

      <div className={`transition-opacity duration-300 ${showForm ? "opacity-50" : "opacity-100"}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Incomes</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Income
          </button>
        </div>

        {/* Affichage des revenus */}
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {incomes.length === 0 && !loading && !error && (
          <p className="text-gray-600">No incomes found.</p>
        )}

        {incomes.length > 0 && (
          <div className="grid gap-4">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {income.source} - ${income.amount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(income.date).toLocaleDateString()}
                  </p>
                  {income.description && (
                    <p className="text-sm text-gray-600">
                      Description: {income.description}
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

      {/* Formulaire affiché conditionnellement au-dessus de l'overlay */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="max-w-md w-full">
            <IncomeForm
              onSuccess={handleIncomeAdded}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Incomes;