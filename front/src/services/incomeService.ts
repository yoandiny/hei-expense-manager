interface IncomeInput {
  amount: number;
  date: string;
  source: string;
  description?: string;
}

// Interface pour un revenu reçu de l'API
interface IncomeResponse {
  id: number;
  amount: number;
  date: string;
  source: string;
  description?: string;
  userId: number;
}

const API_URL = "http://localhost:3000/api/incomes";

// Récupérer le token d'authentification (à adapter selon votre gestion d'auth)
const getAuthToken = () => {
  // Exemple : récupérer un token JWT depuis localStorage
  return localStorage.getItem("token") || "";
};

// Créer un revenu
export const createIncome = async (incomeData: IncomeInput): Promise<IncomeResponse> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(incomeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create income");
  }

  return response.json();
};

// Récupérer tous les revenus
export const getIncomes = async (): Promise<IncomeResponse[]> => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch incomes");
  }

  return response.json();
};

// Récupérer un revenu par ID
export const getIncomeById = async (id: number): Promise<IncomeResponse> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Income not found");
  }

  return response.json();
};

// Mettre à jour un revenu
export const updateIncome = async (id: number, incomeData: IncomeInput): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(incomeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update income");
  }
};

// Supprimer un revenu
export const deleteIncome = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      // "Authorization": `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete income");
  }
};