// src/services/expenseService.ts

const API_URL = "http://localhost:3000/api/expenses";

// 👇 Mets bien export devant pour qu'ils soient visibles ailleurs
export type ExpenseTypeUI = "One-time" | "Recurring";  // côté formulaire
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

export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}

export async function createExpense(expense: CreateExpenseDTO): Promise<Expense> {
  const payload: Expense = {
    ...expense,
    type: mapTypeToAPI(expense.type),
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create expense");
  }
  return response.json();
}

export async function updateExpense(id: number, expense: Expense): Promise<Expense> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }
  return response.json();
}

export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
}
