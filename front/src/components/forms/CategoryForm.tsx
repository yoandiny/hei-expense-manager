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
    category: Category | null;
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
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-4 text-center">
                {category?.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h3>
            {error && (
                <p className="text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">
                    {error}
                </p>
            )}
            <div className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nom de la catégorie"
                    className="w-full p-3 border border-green-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleSubmit}
                        className="bg-yellow-400 text-green-900 px-5 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold shadow-sm"
                    >
                        {category?.id ? 'Enregistrer' : 'Ajouter'}
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400 transition font-semibold shadow-sm"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;