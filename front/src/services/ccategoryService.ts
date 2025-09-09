// categoryService.ts
interface Category {
    id: number;
    name: string;
    userId: number | null;
    isDefault: boolean;
    createdAt: string;
}

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await fetch('/api/categories', {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
    }
    return response.json();
};

export const createCategory = async (name: string): Promise<Category> => {
    if (!name) throw new Error('Le nom de la catégorie est requis');
    const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(), // ← Ajout crucial
        },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Erreur lors de la création');
    }
    return response.json();
};

export const updateCategory = async (id: number, name: string): Promise<Category> => {
    if (!name) throw new Error('Le nom de la catégorie est requis');
    const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(), // ← Ajout crucial
        },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        if (response.status === 403) throw new Error('Impossible de modifier une catégorie par défaut');
        if (response.status === 404) throw new Error('Catégorie non trouvée ou non autorisée');
        throw new Error('Erreur lors de la mise à jour');
    }
    return response.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
    const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(), // ← Ajout crucial
    });
    if (!response.ok) {
        if (response.status === 400) throw new Error('Impossible de supprimer une catégorie associée à des dépenses');
        if (response.status === 404) throw new Error('Catégorie non trouvée ou non autorisée');
        throw new Error('Erreur lors de la suppression');
    }
};