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
            } catch (error: any) {
                setError(error.message);
            }
        };
        fetchCategories();
    }, []);

    const handleDeleteCategory = async (id: number) => {
        try {
            await deleteCategory(id);
            setCategories(categories.filter(cat => cat.id !== id));
            setError(null);
        } catch (error: any) {
            setError(error.message);
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
            } catch (error: any) {
                setError(error.message);
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
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gestion des Catégories</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
                onClick={() => setShowForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
            >
                Nouvelle catégorie
            </button>
            {showForm && (
                <CategoryForm
                    category={editingCategory}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            )}
            <ul className="space-y-2">
                {categories.map(category => (
                    <li key={category.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        <span className="text-lg">{category.name}</span>
                        {!category.isDefault && (
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEditCategory(category)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;