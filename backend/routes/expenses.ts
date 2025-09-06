import { Router } from "express";
// On importe le Router d’Express pour créer des routes séparées

import { createExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expenseController";
// On importe nos fonctions du controller Expense

import { authenticate } from "../middleware/auth";
// Middleware d’authentification qui vérifie le JWT et ajoute req.user

const router = Router(); 
// On crée un mini routeur Express

// On applique le middleware d’authentification à toutes les routes de ce fichier
router.use(authenticate);

// ➕ POST /api/expenses → créer une dépense
router.post("/", createExpense);

// 📋 GET /api/expenses → récupérer toutes les dépenses
router.get("/", getExpenses);

// ✏️ PUT /api/expenses/:id → modifier une dépense par son ID
router.put("/:id", updateExpense);

// ❌ DELETE /api/expenses/:id → supprimer une dépense par son ID
router.delete("/:id", deleteExpense);

// On exporte le router pour l’utiliser dans index.ts
export default router;
