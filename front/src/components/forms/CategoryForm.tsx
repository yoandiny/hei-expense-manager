import { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../../services/ccategoryService.ts';

interface Category {
    id?: number;
    name: string;
    userId?: number | null;
    isDefault?: boolean;
    createdAt?: string;
}

interface CategoryFormProps {
    category: Category | null; // Changé de category?: Category à category: Category | null
    onSubmit: () => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (category) {
            setName(category.name);
        } else {
            setName('');
        }
    }, [category]);

    const handleSubmit = async () => {
        try {
            if (category?.id) {
                await updateCategory(category.id, name);
            } else {
                await createCategory(name);
            }
            setError(null);
            onSubmit();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Une erreur inconnue est survenue');
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold mb-2">{category?.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nom de la catégorie"
                className="border p-2 rounded w-full mb-2"
            />
            <div className="flex space-x-2">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {category?.id ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
};

export default CategoryForm;