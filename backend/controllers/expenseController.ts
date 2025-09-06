import { Request, Response } from "express"; 
// On importe les types de base d’Express pour typer req et res

import prisma from "../prismaClient"; 
// On importe Prisma Client (connexion à la DB) pour faire nos requêtes SQL via TypeScript

// ➕ Créer une dépense
export const createExpense = async (req: Request, res: Response) => {
  try {
    // On récupère les données envoyées par l’utilisateur dans le body JSON
    const { amount, date, categoryId, description, type, startDate, endDate } = req.body;

    // On enregistre la dépense dans la table Expense avec Prisma
    const expense = await prisma.expense.create({
      data: {
        amount, // Montant de la dépense
        date: new Date(date), // On convertit la date en objet Date
        description, // Optionnel
        type, // "One-time" ou "Recurring"
        startDate: startDate ? new Date(startDate) : null, // Pour les récurrentes
        endDate: endDate ? new Date(endDate) : null,       // Fin si récurrente
        userId: req.user.id, // 👈 On associe la dépense à l’utilisateur connecté
        categoryId, // On relie la dépense à une catégorie
      },
    });

    // On renvoie la dépense créée avec un code 201 (Created)
    res.status(201).json(expense);
  } catch (error) {
    console.error(error); // Debug en console si erreur
    res.status(500).json({ error: "Erreur lors de la création de la dépense" });
  }
};

// 📋 Récupérer toutes les dépenses d’un utilisateur
export const getExpenses = async (req: Request, res: Response) => {
  try {
    // On récupère toutes les dépenses liées à l’utilisateur connecté
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id }, // Filtre par user
      include: { category: true }, // On inclut la catégorie pour avoir son nom
      orderBy: { date: "desc" }, // On trie par date décroissante
    });

    // On renvoie la liste en JSON
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des dépenses" });
  }
};

// ✏️ Modifier une dépense
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // On récupère l’ID passé dans l’URL
    const { amount, date, description, type, startDate, endDate, categoryId } = req.body;

    // On met à jour la dépense correspondante
    const expense = await prisma.expense.update({
      where: { id: Number(id) }, // On cast en nombre car req.params est une string
      data: {
        amount,
        date: new Date(date),
        description,
        type,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        categoryId,
      },
    });

    // On renvoie la dépense mise à jour
    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la dépense" });
  }
};

// ❌ Supprimer une dépense
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // On récupère l’ID depuis l’URL

    // On supprime la dépense correspondante
    await prisma.expense.delete({
      where: { id: Number(id) },
    });

    // 204 = succès mais pas de contenu à renvoyer
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de la dépense" });
  }
};
