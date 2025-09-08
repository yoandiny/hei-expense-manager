interface Summary {
    totalExpenses: number;
    categoryCount: number;
    expensesByCategory: { categoryId: number; categoryName: string; total: number }[];
    lastUpdated: string;
}

export const getSummary = async (): Promise<Summary> => {
    const response = await fetch('/api/summary');
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Erreur lors de la récupération du récapitulatif');
    }
    return response.json();
};