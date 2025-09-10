// 👇 Types inchangés
export type ExpenseTypeUI = "One-time" | "Recurring";
export type ExpenseTypeAPI = "ONE_TIME" | "RECURRING";

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

export type CreateExpenseDTO = {
  amount: number;
  type: ExpenseTypeUI;
  date?: string;
  startDate?: string;
  endDate?: string;
  categoryId: number;
  description?: string;
};

// 🧹 UI → API mapper
function mapTypeToAPI(type: ExpenseTypeUI): ExpenseTypeAPI {
  return type === "One-time" ? "ONE_TIME" : "RECURRING";
}

// 🔐 Identique à categoryService.ts — robuste et éprouvé
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("NO_TOKEN");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// 📥 Récupérer toutes les dépenses — ✅ URL RELATIVE
export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch("/api/expenses", {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch expenses (Status: ${response.status})`
    );
  }

  return response.json();
}

// ➕ Créer une dépense — ✅ URL RELATIVE
export async function createExpense(expense: CreateExpenseDTO): Promise<Expense> {
  const payload: Expense = {
    ...expense,
    type: mapTypeToAPI(expense.type),
  };

  const response = await fetch("/api/expenses", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create expense (Status: ${response.status})`
    );
  }

  return response.json();
}

// ✏️ Mettre à jour une dépense — ✅ URL RELATIVE
export async function updateExpense(
  id: number,
  expense: Partial<Expense>
): Promise<Expense> {
  const response = await fetch(`/api/expenses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update expense (Status: ${response.status})`
    );
  }

  return response.json();
}

// ❌ Supprimer une dépense — ✅ URL RELATIVE
export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`/api/expenses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete expense (Status: ${response.status})`
    );
  }
}