// InvestorsTable.tsx
import React from "react";
import type { InvestorApi } from "../types";
import { formatCommitment, formatDate } from "../utils/format";

interface InvestorsTableProps {
  investors: InvestorApi[];
  onInvestorSelect: (investor: InvestorApi) => void;
}

export const InvestorsTable: React.FC<InvestorsTableProps> = ({ investors, onInvestorSelect }) => (
  <section className="w-full">
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm">Id</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm">Name</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm">Type</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm">Date Added</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm">Country</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm">Total Commitment</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((inv, index) => (
            <tr 
              key={inv.id} 
              className={`border-t cursor-pointer transition-all duration-200 group ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-violet-50 hover:shadow-sm`}
              onClick={() => onInvestorSelect(inv)}
              title="Click to view commitments"
            >
              <td className="py-3 px-4 text-gray-600 text-sm">{inv.id}</td>
              <td className="py-3 px-4 font-semibold text-violet-700 group-hover:text-violet-800 text-sm">
                {inv.investor_name}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">
                  →
                </span>
              </td>
              <td className="py-3 px-4 text-gray-700 text-sm">{inv.investor_type}</td>
              <td className="py-3 px-4 text-gray-700 text-sm">{formatDate(inv.investor_date_added)}</td>
              <td className="py-3 px-4 text-gray-700 text-sm">{inv.investor_country}</td>
              <td className="py-3 px-4 font-bold text-violet-700 group-hover:text-violet-800 text-sm">
                {formatCommitment(inv.total_commitment)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
