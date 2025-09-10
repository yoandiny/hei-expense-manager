import { useEffect, useState } from 'react';
import { getSummary } from '../../services/summaryService';
import { formatCurrency } from '../../utils/formaCurrency';
import Chart from '../../components/charts/Chart'; // ← Import du Pie Chart

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

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 text-center max-w-xl">
                    {error}
                </div>
            </div>
        );

    if (!summary)
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="text-gray-600 text-center">Chargement du récapitulatif...</div>
            </div>
        );

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-3xl space-y-8">
                {/* Section Résumé */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Récapitulatif Financier</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-100 text-blue-800 p-6 rounded-lg text-center">
                            <h3 className="text-lg font-semibold mb-2">Total des dépenses</h3>
                            <p className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</p>
                        </div>
                        <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center">
                            <h3 className="text-lg font-semibold mb-2">Nombre de catégories</h3>
                            <p className="text-2xl font-bold">{summary.categoryCount}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Dépenses par catégorie</h3>
                    <div className="overflow-x-auto mb-8">
                        <table className="min-w-full table-auto text-center">
                            <thead>
                            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                                <th className="py-3 px-6">Catégorie</th>
                                <th className="py-3 px-6">Total (€)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {summary.expensesByCategory.map(cat => (
                                <tr key={cat.categoryId} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-4 px-6">{cat.categoryName}</td>
                                    <td className="py-4 px-6">{formatCurrency(cat.total)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-gray-600 mt-4 text-center">
                        Dernière mise à jour : {new Date(summary.lastUpdated).toLocaleString('fr-FR')}
                    </p>
                </div>

                {/* 🥧 PIE CHART — Section séparée en dessous */}
                {summary.expensesByCategory.length > 0 && (
                    <div>
                        <Chart
                            data={summary.expensesByCategory}
                            title="Répartition des dépenses par catégorie"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Summary;