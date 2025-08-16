// InvestorsTable.tsx
import React from "react";
import type { InvestorApi } from "../types";
import { formatCommitment, formatDate } from "../utils/format";
import { Table } from "./Table";
import type { ColumnConfig } from "./Table";

interface InvestorsTableProps {
  investors: InvestorApi[];
  onInvestorSelect: (investor: InvestorApi) => void;
}

export const InvestorsTable: React.FC<InvestorsTableProps> = ({ investors, onInvestorSelect }) => {
  // Define column configuration for investors table
  const investorColumns: ColumnConfig<InvestorApi>[] = [
    {
      key: 'id',
      label: 'Id',
      accessor: 'id',
      className: 'text-gray-600'
    },
    {
      key: 'investor_name',
      label: 'Name',
      accessor: (investor) => (
        <>
          {investor.investor_name}
          <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">
            →
          </span>
        </>
      ),
      className: 'font-semibold text-gray-700'
    },
    {
      key: 'investor_type',
      label: 'Type',
      accessor: 'investor_type',
      className: 'text-gray-700'
    },
    {
      key: 'investor_date_added',
      label: 'Date Added',
      accessor: (investor) => formatDate(investor.investor_date_added),
      className: 'text-gray-700'
    },
    {
      key: 'investor_country',
      label: 'Country',
      accessor: 'investor_country',
      className: 'text-gray-700'
    },
    {
      key: 'total_commitment',
      label: 'Total Commitment',
      accessor: (investor) => formatCommitment(investor.total_commitment),
      className: 'font-bold text-violet-700'
    }
  ];

  return (
    <section className="w-full">
      <Table
        data={investors}
        columns={investorColumns}
        onRowClick={onInvestorSelect}
        emptyMessage="No investors found."
        rowClassName="border-t"
      />
    </section>
  );
};
