import React, { useState } from "react";

type ExpenseFormProps = {
  onSuccess?: () => void;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess }) => {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<"One-time" | "Recurring">("One-time");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const payload = {
    amount,
    type,
    date: type === "One-time" ? date : undefined,
    categoryId: parseInt(category),
    description,
    startDate: type === "Recurring" ? startDate : undefined,
    endDate: type === "Recurring" && endDate ? endDate : undefined,
  };
  console.log("Payload envoyé:", payload); // Log pour déboguer

  try {
    const response = await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create expense");
    }

    alert("✅ Expense added!");
    setAmount(0);
    setDate("");
    setCategory("");
    setDescription("");
    setType("One-time");
    setStartDate("");
    setEndDate("");
    onSuccess?.();
  } catch (error: any) {
    console.error("Erreur fetch:", error); // Log détaillé
    alert("❌ " + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-black p-6 rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "One-time" | "Recurring")}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="One-time">One-time</option>
          <option value="Recurring">Recurring</option>
        </select>
      </div>

      {type === "One-time" && (
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
      )}

      {type === "Recurring" && (
        <>
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium">Category ID</label>
        <input
          type="number"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Enter category ID"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Optional"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Saving..." : "Save Expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;