// CommitmentsTable.tsx
import React, { useState } from "react";
import type { CommitmentApi, AssetClass } from "../types";
import { formatCommitment } from "../utils/format";

interface CommitmentsTableProps {
  commitments: CommitmentApi[];
  assetClasses: AssetClass[];
  investorName?: string;
}

export const CommitmentsTable: React.FC<CommitmentsTableProps> = ({
  commitments,
  assetClasses,
  investorName,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Filter options include "All" and all provided assetClasses
  const filterOptions = ["All", ...assetClasses];

  const filteredCommitments =
    activeFilter === "All"
      ? commitments
      : commitments.filter((c) => c.asset_class === activeFilter);

  // Calculate totals for each asset class
  const getAssetClassTotal = (assetClass: string) => {
    const total = commitments
      .filter((c) => c.asset_class === assetClass)
      .reduce((sum, c) => sum + c.amount, 0);
    return formatCommitment(total);
  };

  const getAllTotal = () => {
    const total = commitments.reduce((sum, c) => sum + c.amount, 0);
    return formatCommitment(total);
  };

  return (
    <section className="w-full mt-14">
      <h2 className="text-4xl font-bold mb-6">
        {investorName ? `Commitments for ${investorName}` : "Commitments"}
      </h2>
      {/* Filters */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {filterOptions.map((cls) => (
          <button
            key={cls}
            className={`flex flex-col items-center px-6 py-4 border rounded-lg font-semibold transition-all duration-200 transform hover:scale-105
              ${
                activeFilter === cls
                  ? "bg-violet-700 text-white border-violet-700 shadow-lg"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-violet-50 hover:border-violet-200 hover:shadow-md"
              }
            `}
            onClick={() => setActiveFilter(cls)}
          >
            <span className="text-base">{cls}</span>
            <span className="text-xs mt-2 font-normal opacity-90">
              {cls === "All" ? getAllTotal() : getAssetClassTotal(cls)}
            </span>
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-6 text-left font-semibold text-gray-700">Id</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">Asset Class</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">Currency</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommitments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 px-6 text-center text-gray-500">
                  {commitments.length === 0 
                    ? "No commitments found for this investor."
                    : `No commitments found for ${activeFilter} asset class.`
                  }
                </td>
              </tr>
            ) : (
              filteredCommitments.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-5 px-6 text-gray-600">{c.id}</td>
                  <td className="py-5 px-6 font-medium text-gray-800">{c.asset_class}</td>
                  <td className="py-5 px-6 text-gray-700">{c.currency}</td>
                  <td className="py-5 px-6 font-semibold text-violet-700">{formatCommitment(c.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
