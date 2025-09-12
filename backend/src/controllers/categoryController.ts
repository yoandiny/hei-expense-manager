import { Request, Response } from 'express';
import prisma from '../PrismaClient';

export const getCategories = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    const userId = req.user.id;

    try {
        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { userId: null },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error("Erreur dans getCategories:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    const userId = req.user.id;

    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Le nom de la catégorie est requis" });
        }

        const category = await prisma.category.create({
            data: { name, userId, isDefault: false },
        });

        res.status(201).json(category);
    } catch (error) {
        console.error("Erreur dans createCategory:", error);
        res.status(500).json({ error: "Erreur lors de la création de la catégorie" });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    const userId = req.user.id;

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Le nom de la catégorie est requis" });
    }

    try {
        const category = await prisma.category.findFirst({
            where: {
                id: parseInt(id),
                OR: [
                    { userId: userId },
                    { userId: null },
                ],
            },
        });

        if (!category) {
            return res.status(404).json({ error: "Catégorie non trouvée ou non autorisée" });
        }
        if (category.isDefault) {
            return res.status(403).json({ error: "Impossible de modifier une catégorie par défaut" });
        }

        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name },
        });

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Erreur dans updateCategory:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    const userId = req.user.id;

    const { id } = req.params;

    try {
        const category = await prisma.category.findFirst({
            where: {
                id: parseInt(id),
                OR: [
                    { userId: userId },
                    { userId: null },
                ],
            },
        });

        if (!category) {
            return res.status(404).json({ error: "Catégorie non trouvée ou non autorisée" });
        }
        if (category.isDefault) {
            return res.status(403).json({ error: "Impossible de supprimer une catégorie par défaut" });
        }

        const expenseCount = await prisma.expense.count({
            where: { categoryId: parseInt(id) },
        });

        if (expenseCount > 0) {
            return res.status(400).json({ error: "Impossible de supprimer une catégorie associée à des dépenses" });
        }

        await prisma.category.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        console.error("Erreur dans deleteCategory:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
