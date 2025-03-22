"use client";

import { useState, useEffect } from "react";

export default function UtangSummary({ loans }) {
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    // Only analyze unpaid loans
    const unpaidLoans = loans.filter((loan) => !loan.isPaid);
    const total = unpaidLoans.reduce((sum, loan) => sum + loan.amount, 0);

    // Group by platform
    const platformMap = {};
    unpaidLoans.forEach((loan) => {
      if (!platformMap[loan.platform]) {
        platformMap[loan.platform] = 0;
      }
      platformMap[loan.platform] += loan.amount;
    });

    // Convert to array and add percentages
    const result = Object.entries(platformMap).map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));

    // Sort by amount descending
    result.sort((a, b) => b.amount - a.amount);
    setPlatforms(result);
  }, [loans]);

  if (platforms.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-center">No unpaid loans</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
          <tr>
            <th scope="col" className="py-3 px-4">
              Platform
            </th>
            <th scope="col" className="py-3 px-4 text-right">
              Amount
            </th>
            <th scope="col" className="py-3 px-4 text-right">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform, index) => (
            <tr
              key={platform.name}
              className={`border-b border-gray-700 ${
                index % 2 === 0 ? "bg-gray-750" : ""
              }`}
            >
              <td className="py-3 px-4 font-medium text-white">
                {platform.name}
              </td>
              <td className="py-3 px-4 text-right text-white">
                ₱{platform.amount.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right text-white">
                {platform.percentage.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-750 font-medium">
          <tr>
            <td className="py-3 px-4 text-white">Total</td>
            <td className="py-3 px-4 text-right text-white">
              ₱
              {platforms
                .reduce((sum, platform) => sum + platform.amount, 0)
                .toFixed(2)}
            </td>
            <td className="py-3 px-4 text-right text-white">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
