import { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '../../services/ccategoryService.ts';
import CategoryForm from '../../components/forms/CategoryForm';

interface Category {
    id: number;
    name: string;
    userId: number | null;
    isDefault: boolean;
    createdAt: string;
}

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
                setError(null);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Une erreur inconnue est survenue');
                }
            }
        };
        fetchCategories();
    }, []);

    const handleDeleteCategory = async (id: number) => {
        try {
            await deleteCategory(id);
            setCategories(categories.filter(cat => cat.id !== id));
            setError(null);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Une erreur inconnue est survenue');
            }
        }
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        setEditingCategory(null);
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
                setError(null);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Une erreur inconnue est survenue');
                }
            }
        };
        fetchCategories();
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCategory(null);
        setError(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestion des Catégories</h2>
            {error && (
                <p className="text-red-500 bg-red-50 border border-red-200 rounded p-3 mb-6 text-center">
                    {error}
                </p>
            )}
            <div className="mb-6 text-center">
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                    Nouvelle catégorie
                </button>
            </div>
            {showForm && (
                <CategoryForm
                    category={editingCategory}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            )}
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                        <th className="py-3 px-6 text-left">Nom</th>
                        <th className="py-3 px-6 text-left">Date de création</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(category => (
                        <tr key={category.id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-4 px-6">{category.name}</td>
                            <td className="py-4 px-6">
                                {new Date(category.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-4 px-6 text-center">
                                {!category.isDefault && (
                                    <div className="flex justify-center space-x-3">
                                        <button
                                            onClick={() => handleEditCategory(category)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;