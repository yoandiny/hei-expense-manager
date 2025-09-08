import { useEffect, useState } from 'react';
import { getSummary } from '../../services/summaryService';

interface Summary {
    totalExpenses: number;
    categoryCount: number;
    expensesByCategory: { categoryId: number; categoryName: string; total: number }[];
    lastUpdated: string;
}

const Summary: React.FC = () => {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getSummary();
                setSummary(data);
                setError(null);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            }
        };
        fetchSummary();
    }, []);

    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!summary) return <div className="text-gray-500 text-center">Chargement...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Récapitulatif Financier</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800">Total des dépenses</h3>
                        <p className="text-2xl font-bold text-blue-600">{summary.totalExpenses.toFixed(2)} €</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800">Nombre de catégories</h3>
                        <p className="text-2xl font-bold text-green-600">{summary.categoryCount}</p>
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Dépenses par catégorie</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Catégorie</th>
                            <th className="py-3 px-6 text-right">Total (€)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {summary.expensesByCategory.map(cat => (
                            <tr key={cat.categoryId} className="border-b hover:bg-gray-50 transition">
                                <td className="py-4 px-6">{cat.categoryName}</td>
                                <td className="py-4 px-6 text-right">{cat.total.toFixed(2)} €</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-gray-600 mt-4 text-center">
                    Dernière mise à jour : {new Date(summary.lastUpdated).toLocaleString('fr-FR')}
                </p>
            </div>
        </div>
    );
};

export default Summary;