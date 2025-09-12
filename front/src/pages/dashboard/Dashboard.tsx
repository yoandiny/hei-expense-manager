import { useEffect, useState } from 'react';
import { getSummary, getBudgetAlert, getTotalIncome } from '../../services/summaryService';
import { formatCurrency } from '../../utils/formatCurrency';
import Chart from '../../components/charts/Chart';

interface Summary {
    totalExpenses: number;
    categoryCount: number;
    expensesByCategory: { categoryId: number; categoryName: string; total: number }[];
    lastUpdated: string;
}

interface BudgetAlert {
    alert: boolean;
    message: string;
}

interface IncomeSummary {
    totalIncome: number;
}

const Dashboard: React.FC = () => {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [alert, setAlert] = useState<BudgetAlert | null>(null);
    const [income, setIncome] = useState<IncomeSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryData, alertData, incomeData] = await Promise.all([
                    getSummary(),
                    getBudgetAlert(),
                    getTotalIncome(),
                ]);
                setSummary(summaryData);
                setAlert(alertData);
                setIncome(incomeData);
                setError(null);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-xl shadow-md">
                    {error}
                </div>
            </div>
        );
    }

    if (!summary || !income) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="text-gray-600 text-center text-lg">Chargement du récapitulatif...</div>
            </div>
        );
    }

    const balance = income.totalIncome - summary.totalExpenses;

    const isLowBalance = balance <= 50 && balance > 0;

    return (
        <div className="min-h-screen flex items-start justify-center p-6 bg-gray-50 dark:bg-slate-900">
            <div className="w-full max-w-4xl space-y-8">
                {alert && alert.alert && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
                        <p className="font-bold text-lg">⚠️ {alert.message}</p>
                    </div>
                )}

                {isLowBalance && (
                    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-lg shadow-md">
                        <p className="font-bold text-lg">💡 Attention : votre solde est faible ({formatCurrency(balance)})</p>
                        <p className="text-sm">Pensez à limiter vos dépenses ou à ajouter des revenus.</p>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-700 dark:border-slate-600 rounded-2xl shadow-xl p-8 border border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Récapitulatif Financier</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-100 text-blue-800 p-6 rounded-xl text-center shadow transition-transform hover:scale-105">
                            <h3 className="text-lg font-semibold mb-2">Total des revenus</h3>
                            <p className="text-2xl font-bold">{formatCurrency(income.totalIncome)}</p>
                        </div>
                        <div className="bg-amber-100 text-amber-800 p-6 rounded-xl text-center shadow transition-transform hover:scale-105">
                            <h3 className="text-lg font-semibold mb-2">Total des dépenses</h3>
                            <p className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</p>
                        </div>
                        <div className="bg-gray-100 text-gray-800 p-6 rounded-xl text-center shadow transition-transform hover:scale-105">
                            <h3 className="text-lg font-semibold mb-2">Solde</h3>
                            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                                {formatCurrency(balance)}
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Dépenses par catégorie</h3>
                    <div className="overflow-x-auto mb-8">
                        <table className="min-w-full table-auto text-center border border-gray-200 rounded-lg overflow-hidden shadow">
                            <thead>
                            <tr className="bg-gray-800 text-white uppercase text-sm">
                                <th className="py-3 px-6">Catégorie</th>
                                <th className="py-3 px-6">Total (€)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {summary.expensesByCategory.map((cat, idx) => (
                                <tr
                                    key={cat.categoryId}
                                    className={`transition ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-amber-50`}
                                >
                                    <td className="py-4 px-6 text-gray-800 font-medium">{cat.categoryName}</td>
                                    <td className="py-4 px-6 font-semibold text-gray-900">{formatCurrency(cat.total)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-gray-600 mt-4 text-center">
                        Dernière mise à jour :{' '}
                        <span className="font-medium text-gray-800">
            {new Date(summary.lastUpdated).toLocaleString('fr-FR')}
          </span>
                    </p>
                </div>

                {summary.expensesByCategory.length > 0 && (
                    <div className="bg-white dark:bg-slate-700 dark:border-slate-600 rounded-2xl shadow-xl p-6 border border-gray-200">
                        <Chart data={summary.expensesByCategory} title="Répartition des dépenses par catégorie" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
    