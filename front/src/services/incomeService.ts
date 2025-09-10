export interface IncomeInput {
  amount: number;
  date: string;
  source: string;
  description?: string;
}

export interface IncomeResponse {
  id: number;
  amount: number;
  date: string;
  source: string;
  description?: string;
  userId: number;
}

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

export async function getIncomes(): Promise<IncomeResponse[]> {
  const response = await fetch("/api/incomes", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch incomes (Status: ${response.status})`
    );
  }

  return response.json();
}

export async function createIncome(incomeData: IncomeInput): Promise<IncomeResponse> {
  const response = await fetch("/api/incomes", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(incomeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create income (Status: ${response.status})`
    );
  }

  return response.json();
}

export async function updateIncome(
  id: number,
  incomeData: Partial<IncomeInput>
): Promise<IncomeResponse> {
  const response = await fetch(`/api/incomes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(incomeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update income (Status: ${response.status})`
    );
  }

  return response.json();
}

export async function deleteIncome(id: number): Promise<void> {
  const response = await fetch(`/api/incomes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete income (Status: ${response.status})`
    );
  }
}