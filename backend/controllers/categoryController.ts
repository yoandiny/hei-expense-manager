import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
    const userId = 1;
    try {
        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { userId: null }, // catégories globales
                ],
            },
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Le nom de la catégorie est requis' });

    const userId = 1;
    try {
        const category = await prisma.category.create({
            data: {
                name,
                userId,
                isDefault: false,
            },
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = 1;

    if (!name) return res.status(400).json({ error: 'Le nom de la catégorie est requis' });

    try {
        const category = await prisma.category.findFirst({
            where: { id: parseInt(id), userId },
        });

        if (!category) return res.status(404).json({ error: 'Catégorie non trouvée ou non autorisée' });
        if (category.isDefault) return res.status(403).json({ error: 'Impossible de modifier une catégorie par défaut' });

        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name },
        });

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = 1;

    try {
        const category = await prisma.category.findFirst({
            where: { id: parseInt(id), userId },
        });

        if (!category) return res.status(404).json({ error: 'Catégorie non trouvée ou non autorisée' });
        if (category.isDefault) return res.status(403).json({ error: 'Impossible de supprimer une catégorie par défaut' });

        const expenseCount = await prisma.expense.count({
            where: { categoryId: parseInt(id) },
        });

        if (expenseCount > 0) return res.status(400).json({ error: 'Impossible de supprimer une catégorie associée à des dépenses' });

        await prisma.category.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
