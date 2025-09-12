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
                setError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
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
            setError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
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
                setError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
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
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
            <main className="flex-1 p-6 flex justify-center">
                <div className="w-full max-w-2xl">
                    <div className="p-6 bg-white dark:bg-slate-700 rounded-2xl shadow-lg w-full text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Categories management</h2>

                        {error && (
                            <p className="text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-6">
                                {error}
                            </p>
                        )}

                        <div className="mb-6">
                            <button
                                onClick={() => setShowForm(true)}
                                className="gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-md transition font-semibold"
                            >
                                <span className="text-xl">+</span> Nouvelle catégorie
                            </button>
                        </div>

                        {showForm && (
                            <CategoryForm
                                category={editingCategory}
                                onSubmit={handleFormSubmit}
                                onCancel={handleCancel}
                            />
                        )}

                        <div className="bg-white rounded-lg shadow-lg overflow-x-auto mt-6">
                            <table className="min-w-full table-auto text-center border-collapse rounded-lg overflow-hidden shadow-sm">
                                <thead>
                                <tr className="bg-gray-200 text-gray-800 uppercase text-sm font-semibold">
                                    <th className="py-3 px-6 text-left">Nom</th>
                                    <th className="py-3 px-6 text-left">Date de création</th>
                                    <th className="py-3 px-6">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {categories.map((category, index) => (
                                    <tr
                                        key={category.id}
                                        className={`border-b transition ${
                                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-gray-100`}
                                    >
                                        <td className="py-4 px-6 text-left text-gray-800">{category.name}</td>
                                        <td className="py-4 px-6 text-left text-gray-800">
                                            {new Date(category.createdAt).toLocaleDateString("fr-FR")}
                                        </td>
                                        <td className="py-4 px-6">
                                            {!category.isDefault && (
                                                <div className="flex justify-center space-x-3">
                                                    <button
                                                        onClick={() => handleEditCategory(category)}
                                                        className="flex items-center gap-1 bg-amber-500 text-white px-3 py-2 rounded-lg
                                             hover:bg-amber-600 transition text-sm shadow-sm"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg
                                              hover:bg-red-600 transition text-sm shadow-sm"
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
                        {categories.length === 0 && (
                            <div className="p-6 mt-4 text-gray-600 italic bg-gray-50 rounded-lg shadow-sm">
                                Aucune catégorie disponible. Ajoutez-en une !
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );

};

export default Categories;
