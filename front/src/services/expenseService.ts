const API_URL = "http://localhost:3000/api/expenses";

// 👇 Mets bien export devant pour qu'ils soient visibles ailleurs
export type ExpenseTypeUI = "One-time" | "Recurring"; // côté formulaire
export type ExpenseTypeAPI = "ONE_TIME" | "RECURRING"; // côté backend

export type Expense = {
  id?: number;
  amount: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  categoryId: number;
  description?: string;
  type: ExpenseTypeAPI;
  createdAt?: string;
};

// ✅ Type DTO pour la création (exporté aussi)
export type CreateExpenseDTO = {
  amount: number;
  type: ExpenseTypeUI;
  date?: string;
  startDate?: string;
  endDate?: string;
  categoryId: number;
  description?: string;
};

// 🧹 helper pour convertir UI → API
function mapTypeToAPI(type: ExpenseTypeUI): ExpenseTypeAPI {
  return type === "One-time" ? "ONE_TIME" : "RECURRING";
}

// Récupérer le token d'authentification (à adapter selon votre gestion d'auth)
const getAuthToken = () => {
  // Exemple : récupérer un token JWT depuis localStorage
  return localStorage.getItem("token") || "";
};

// Récupérer toutes les dépenses
export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch expenses");
  }

  return response.json();
}

// Créer une dépense
export async function createExpense(expense: CreateExpenseDTO): Promise<Expense> {
  const payload: Expense = {
    ...expense,
    type: mapTypeToAPI(expense.type),
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create expense");
  }

  return response.json();
}

// Mettre à jour une dépense
export async function updateExpense(id: number, expense: Expense): Promise<Expense> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update expense");
  }

  return response.json();
}

// Supprimer une dépense
export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete expense");
  }
}