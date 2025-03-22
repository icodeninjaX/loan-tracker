"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddUtang() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    platform: "",
    amount: "",
    dueDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing loans from localStorage or initialize empty array
    const existingLoans = JSON.parse(localStorage.getItem("loans") || "[]");

    // Add new loan with ID and date
    const newLoan = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      dateAdded: new Date().toISOString(),
      isPaid: false,
    };

    // Save to localStorage
    localStorage.setItem("loans", JSON.stringify([...existingLoans, newLoan]));

    // Navigate back to home
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 md:p-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            Add New Utang
          </span>
        </h1>
        <p className="text-gray-400 mt-2">Record a new loan or debt</p>
      </div>

      <div className="max-w-lg mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-lg rounded-xl border border-gray-700 p-6"
        >
          <div className="mb-5">
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              htmlFor="platform"
            >
              Platform/Person
            </label>
            <input
              className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="platform"
              name="platform"
              type="text"
              placeholder="e.g., Bank, App, Person"
              value={formData.platform}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              htmlFor="dueDate"
            >
              Due Date
            </label>
            <input
              className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              htmlFor="notes"
            >
              Notes (Optional)
            </label>
            <textarea
              className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="notes"
              name="notes"
              placeholder="Additional notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="flex items-center justify-between mt-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:translate-y-[-2px]"
              type="submit"
            >
              Save Utang
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
