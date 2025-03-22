"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    // Load loans from localStorage
    const storedLoans = JSON.parse(localStorage.getItem("loans") || "[]");
    setLoans(storedLoans);
  }, []);

  const handleMarkAsPaid = (id) => {
    const updatedLoans = loans.map((loan) =>
      loan.id === id ? { ...loan, isPaid: !loan.isPaid } : loan
    );

    localStorage.setItem("loans", JSON.stringify(updatedLoans));
    setLoans(updatedLoans);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      const updatedLoans = loans.filter((loan) => loan.id !== id);
      localStorage.setItem("loans", JSON.stringify(updatedLoans));
      setLoans(updatedLoans);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays <= 7) return "upcoming";
    return "normal";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 md:p-8">
      {/* Header with export button */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              Utang Tracker
            </span>
          </h1>
          <p className="text-gray-400 mt-2">
            Manage and track your loans in one place
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              // Convert loans to CSV
              const headers = [
                "Platform",
                "Amount",
                "Due Date",
                "Status",
                "Notes",
              ];
              const rows = loans.map((loan) => [
                loan.platform,
                loan.amount,
                loan.dueDate,
                loan.isPaid ? "Paid" : "Unpaid",
                loan.notes || "",
              ]);

              const csvContent = [
                headers.join(","),
                ...rows.map((row) => row.join(",")),
              ].join("\n");

              // Create download link
              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.setAttribute("href", url);
              a.setAttribute("download", "utang_data.csv");
              a.click();
            }}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
          >
            Export CSV
          </button>
          <Link
            href="/add"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:translate-y-[-2px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Utang
          </Link>
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-5">
            <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Total Utang
            </h2>
            <p className="text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
              ₱
              {loans.reduce((total, loan) => total + loan.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-5">
            <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Unpaid
            </h2>
            <p className="text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-red-500">
              ₱
              {loans
                .filter((loan) => !loan.isPaid)
                .reduce((total, loan) => total + loan.amount, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-5">
            <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Paid
            </h2>
            <p className="text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
              ₱
              {loans
                .filter((loan) => loan.isPaid)
                .reduce((total, loan) => total + loan.amount, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      {loans.filter(
        (loan) => !loan.isPaid && getDueDateStatus(loan.dueDate) === "upcoming"
      ).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">
            Upcoming Payments
          </h2>
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden p-4">
            <div className="space-y-3">
              {loans
                .filter(
                  (loan) =>
                    !loan.isPaid &&
                    getDueDateStatus(loan.dueDate) === "upcoming"
                )
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map((loan) => (
                  <div
                    key={loan.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-750 border border-gray-700"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {loan.platform}
                      </div>
                      <div className="text-sm text-gray-400">
                        Due: {formatDate(loan.dueDate)}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-white">
                      ₱{loan.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        {loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-400 mb-6">
              No utang records yet. Add your first loan to get started.
            </p>
            <Link
              href="/add"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:translate-y-[-2px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Your First Loan
            </Link>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="p-4 border-b border-gray-700 bg-gray-850 flex flex-col md:flex-row justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-64 mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search loans..."
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    if (searchTerm) {
                      const filtered = JSON.parse(
                        localStorage.getItem("loans") || "[]"
                      ).filter(
                        (loan) =>
                          loan.platform.toLowerCase().includes(searchTerm) ||
                          (loan.notes &&
                            loan.notes.toLowerCase().includes(searchTerm))
                      );
                      setLoans(filtered);
                    } else {
                      setLoans(
                        JSON.parse(localStorage.getItem("loans") || "[]")
                      );
                    }
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-700 text-white border border-gray-600 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    onChange={(e) => {
                      const filtered = JSON.parse(
                        localStorage.getItem("loans") || "[]"
                      );
                      if (e.target.value !== "all") {
                        const isCompleted = e.target.value === "paid";
                        setLoans(
                          filtered.filter((loan) => loan.isPaid === isCompleted)
                        );
                      } else {
                        setLoans(filtered);
                      }
                    }}
                  >
                    <option value="all">All Loans</option>
                    <option value="unpaid">Unpaid Only</option>
                    <option value="paid">Paid Only</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    className="appearance-none bg-gray-700 text-white border border-gray-600 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    onChange={(e) => {
                      const sortedLoans = [...loans];
                      if (e.target.value === "amount") {
                        sortedLoans.sort((a, b) => b.amount - a.amount);
                      } else if (e.target.value === "date") {
                        sortedLoans.sort(
                          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
                        );
                      }
                      setLoans(sortedLoans);
                    }}
                  >
                    <option value="">Sort By</option>
                    <option value="amount">Amount (High to Low)</option>
                    <option value="date">Due Date (Soonest)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Platform
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className={`${
                        loan.isPaid
                          ? "bg-opacity-50 bg-green-900"
                          : getDueDateStatus(loan.dueDate) === "overdue"
                          ? "bg-opacity-20 bg-red-900"
                          : getDueDateStatus(loan.dueDate) === "upcoming"
                          ? "bg-opacity-20 bg-yellow-900"
                          : ""
                      } hover:bg-gray-750 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {loan.platform}
                        </div>
                        {loan.notes && (
                          <div className="text-xs text-gray-400 mt-1">
                            {loan.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          ₱{loan.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {formatDate(loan.dueDate)}
                        </div>
                        {!loan.isPaid &&
                          getDueDateStatus(loan.dueDate) === "overdue" && (
                            <div className="text-xs text-red-400 mt-1">
                              Overdue
                            </div>
                          )}
                        {!loan.isPaid &&
                          getDueDateStatus(loan.dueDate) === "upcoming" && (
                            <div className="text-xs text-yellow-400 mt-1">
                              Due soon
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            loan.isPaid
                              ? "bg-green-900 text-green-200"
                              : "bg-yellow-900 text-yellow-200"
                          }`}
                        >
                          {loan.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link
                            href={`/edit/${loan.id}`}
                            className="px-3 py-1 rounded-md text-xs font-medium bg-blue-700 hover:bg-blue-600 text-white transition-colors text-center"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleMarkAsPaid(loan.id)}
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              loan.isPaid
                                ? "bg-yellow-700 hover:bg-yellow-600 text-white"
                                : "bg-green-700 hover:bg-green-600 text-white"
                            } transition-colors`}
                          >
                            {loan.isPaid ? "Mark Unpaid" : "Mark Paid"}
                          </button>
                          <button
                            onClick={() => handleDelete(loan.id)}
                            className="px-3 py-1 rounded-md text-xs font-medium bg-red-700 hover:bg-red-600 text-white transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
