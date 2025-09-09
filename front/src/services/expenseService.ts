
const API_URL = "http://localhost:5000/api/expenses"; // Ajuste à 5000 si nécessaire

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

// Récupérer le token d'authentification
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage, please log in to get a valid token");
    return null; // Retourne null pour éviter un 401 silencieux
  }
  return token;
};

// Récupérer toutes les dépenses
export async function getExpenses(token: string): Promise<Expense[]> {
  const response = await fetch("/api/expenses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch expenses (Status: ${response.status})`);
  }

  return response.json();
}


// Créer une dépense
export async function createExpense(expense: CreateExpenseDTO): Promise<Expense> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No valid token, please log in");
  }

  const payload: Expense = {
    ...expense,
    type: mapTypeToAPI(expense.type),
  };

  console.log("📤 Sending payload:", payload); // Log les données envoyées
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  console.log("📥 Response status:", response.status); // Log le statut
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("📕 Error response:", error); // Log l'erreur
    throw new Error(error.message || `Failed to create expense (Status: ${response.status})`);
  }

  return response.json();
}

// Mettre à jour une dépense
export async function updateExpense(id: number, expense: Expense): Promise<Expense> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No valid token, please log in");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });

  console.log("📥 Response status:", response.status); // Log le statut
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("📕 Error response:", error); // Log l'erreur
    throw new Error(error.message || `Failed to update expense (Status: ${response.status})`);
  }

  return response.json();
}

// Supprimer une dépense
export async function deleteExpense(id: number): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No valid token, please log in");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  console.log("📥 Response status:", response.status); // Log le statut
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("📕 Error response:", error); // Log l'erreur
    throw new Error(error.message || `Failed to delete expense (Status: ${response.status})`);
  }
}
