// services/summaryService.ts

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

// Ajoute ce type si tu veux (optionnel)
interface IncomeSummary {
    totalIncome: number;
}

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getSummary = async (): Promise<Summary> => {
    const response = await fetch('/api/summary', {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Erreur lors de la récupération du récapitulatif');
    }
    return response.json();
};

export const getBudgetAlert = async (): Promise<BudgetAlert> => {
    const response = await fetch('/api/summary/alerts', {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Erreur lors de la récupération de l’alerte budgétaire');
    }
    return response.json();
};

// Ajoute cette fonction
export const getTotalIncome = async (): Promise<IncomeSummary> => {
    const response = await fetch('/api/summary/income', {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Erreur lors de la récupération des revenus');
    }

    return response.json();
};