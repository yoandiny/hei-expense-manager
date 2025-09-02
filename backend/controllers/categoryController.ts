import { Request, Response } from 'express';
import { prisma } from '../../generated/prisma';

export const getCategories = (req: Request, res: Response) => {
    const userId = 1;
    prisma.category.findMany({
        where: {
            OR: [
                { userId: userId },
                { userId: null },
            ],
        },
    })
        .then(categories => {
            res.status(200).json(categories);
        })
        .catch(error => {
            res.status(500).json({ error: 'Erreur serveur' });
        });
};


export const createCategory = (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }
    const userId = 1;
    prisma.category.create({
        data: {
            name,
            userId: userId,
            isDefault: false,
        },
    })
        .then(category => {
            res.status(201).json(category);
        })
        .catch(error => {
            res.status(500).json({ error: 'Erreur serveur' });
        });
};


export const updateCategory = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = 1;

    if (!name) {
        return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }

    prisma.category.findFirst({
        where: {
            id: parseInt(id),
            userId: userId,
        },
    })
        .then(category => {
            if (!category) {
                return res.status(404).json({ error: 'Catégorie non trouvée ou non autorisée' });
            }
            if (category.isDefault) {
                return res.status(403).json({ error: 'Impossible de modifier une catégorie par défaut' });
            }
            return prisma.category.update({
                where: { id: parseInt(id) },
                data: { name },
            })
                .then(updatedCategory => {
                    res.status(200).json(updatedCategory);
                });
        })
        .catch(error => {
            res.status(500).json({ error: 'Erreur serveur' });
        });
};

export const deleteCategory = (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = 1;

    prisma.category.findFirst({
        where: {
            id: parseInt(id),
            userId: userId,
        },
    })
        .then(category => {
            if (!category) {
                return res.status(404).json({ error: 'Catégorie non trouvée ou non autorisée' });
            }
            if (category.isDefault) {
                return res.status(403).json({ error: 'Impossible de supprimer une catégorie par défaut' });
            }
            return prisma.expense.count({
                where: {
                    categoryId: parseInt(id),
                },
            })
                .then(expenseCount => {
                    if (expenseCount > 0) {
                        return res.status(400).json({ error: 'Impossible de supprimer une catégorie associée à des dépenses' });
                    }
                    // Supprimer la catégorie
                    return prisma.category.delete({
                        where: { id: parseInt(id) },
                    })
                        .then(() => {
                            res.status(204).send(); // Succès, pas de contenu
                        });
                });
        })
        .catch(error => {
            res.status(500).json({ error: 'Erreur serveur' });
        });
};