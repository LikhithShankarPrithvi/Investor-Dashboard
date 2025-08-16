// CommitmentsTable.tsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import type { CommitmentApi, AssetClass } from "../types";
import { formatCommitment } from "../utils/format";
import { Table } from "./Table";
import type { ColumnConfig } from "./Table";

interface CommitmentsTableProps {
  commitments: CommitmentApi[];
  assetClasses: AssetClass[];
  investorName?: string;
  onBackToInvestors?: () => void;
}

export const CommitmentsTable: React.FC<CommitmentsTableProps> = ({
  commitments,
  assetClasses,
  onBackToInvestors,
}) => {
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate asset class statistics
  const assetClassStats = useMemo(() => {
    const stats: { [key: string]: { count: number; total: number } } = {};
    
    commitments.forEach(commitment => {
      const assetClass = commitment.asset_class;
      if (!stats[assetClass]) {
        stats[assetClass] = { count: 0, total: 0 };
      }
      stats[assetClass].count += 1;
      stats[assetClass].total += commitment.amount;
    });

    return stats;
  }, [commitments]);

  // Get total stats for "All" filter
  const totalStats = useMemo(() => {
    return commitments.reduce(
      (acc, commitment) => ({
        count: acc.count + 1,
        total: acc.total + commitment.amount
      }),
      { count: 0, total: 0 }
    );
  }, [commitments]);

  // Filter commitments based on selected asset class
  const filteredCommitments = useMemo(() => {
    if (selectedAssetClass === 'All') {
      return commitments;
    }
    return commitments.filter(commitment => commitment.asset_class === selectedAssetClass);
  }, [commitments, selectedAssetClass]);

  // Handle dropdown selection
  const handleDropdownSelect = (assetClass: string) => {
    setSelectedAssetClass(assetClass);
    setIsDropdownOpen(false);
  };

  // Get display text for selected asset class in dropdown
  const getSelectedDisplayText = () => {
    if (selectedAssetClass === 'All') {
      return `All (£${formatCommitment(totalStats.total)})`;
    }
    const stats = assetClassStats[selectedAssetClass];
    return stats ? `${selectedAssetClass} (£${formatCommitment(stats.total)})` : selectedAssetClass;
  };

  // Define column configuration for commitments table
  const commitmentColumns: ColumnConfig<CommitmentApi>[] = [
    {
      key: 'id',
      label: 'Id',
      accessor: 'id',
      className: 'text-gray-600'
    },
    {
      key: 'asset_class',
      label: 'Asset Class',
      accessor: 'asset_class',
      className: 'font-medium text-gray-800'
    },
    {
      key: 'currency',
      label: 'Currency',
      accessor: 'currency',
      className: 'text-gray-700'
    },
    {
      key: 'amount',
      label: 'Amount',
      accessor: (commitment) => formatCommitment(commitment.amount),
      className: 'font-semibold text-gray-700'
    }
  ];

  return (
    <section className="w-full h-full flex flex-col">
      {/* Title and back button */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">Commitments</h2>
        {onBackToInvestors && (
          <button
            onClick={onBackToInvestors}
            className="inline-flex items-center justify-center px-10 w-10 h-10 text-gray-600 bg-white border border-gray-300 rounded-lg hover:border-gray-900 hover:text-gray-700 transition-colors"
            title="Back to Investors"
          >
            ←
          </button>
        )}
      </div>

      {/* Asset Class Filter - Desktop Buttons */}
      <div className="mb-6 flex-shrink-0 hidden md:block">
        <div className="flex flex-wrap gap-3">
          {/* All button */}
          <button
            onClick={() => setSelectedAssetClass('All')}
            className={`px-4 py-3 border-2 text-sm font-medium transition-all duration-100 ${
              selectedAssetClass === 'All'
                ? 'bg-gray-300 text-gray-700 border-gray-700 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 '
            }`}
          >
            <div className="text-center">
              <div className="font-semibold">All</div>
              <div className="text-xs opacity-90">
                £{formatCommitment(totalStats.total)}
              </div>
            </div>
          </button>

          {/* Individual asset class buttons */}
          {assetClasses.map((assetClass) => {
            const stats = assetClassStats[assetClass];
            if (!stats) return null;

            return (
              <button
                key={assetClass}
                onClick={() => setSelectedAssetClass(assetClass)}
                className={`px-4 py-3 border-2 text-sm font-medium transition-all duration-100 ${
                  selectedAssetClass === assetClass
                    ? 'bg-gray-300 text-gray-700 border-gray-700 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 '
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{assetClass}</div>
                  <div className="text-xs opacity-90">
                    £{formatCommitment(stats.total)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset Class Filter - Mobile Dropdown */}
      <div className="mb-6 flex-shrink-0 md:hidden relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-left text-sm font-medium text-gray-700 hover:border-gray-500 transition-all duration-100 flex items-center justify-between"
        >
          <span>{getSelectedDisplayText()}</span>
          <span className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-300 shadow-lg max-h-64 overflow-y-auto">
            {/* All option */}
            <button
              onClick={() => handleDropdownSelect('All')}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                selectedAssetClass === 'All' ? 'bg-gray-100 font-semibold' : ''
              }`}
            >
              <div>All</div>
              <div className="text-xs text-gray-500 mt-1">
                £{formatCommitment(totalStats.total)}
              </div>
            </button>

            {/* Individual asset class options */}
            {assetClasses.map((assetClass) => {
              const stats = assetClassStats[assetClass];
              if (!stats) return null;

              return (
                <button
                  key={assetClass}
                  onClick={() => handleDropdownSelect(assetClass)}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors border-t border-gray-200 ${
                    selectedAssetClass === assetClass ? 'bg-gray-100 font-semibold' : ''
                  }`}
                >
                  <div>{assetClass}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    £{formatCommitment(stats.total)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Scrollable table */}
      <Table
        data={filteredCommitments}
        columns={commitmentColumns}
        emptyMessage={`No ${selectedAssetClass === 'All' ? '' : selectedAssetClass.toLowerCase() + ' '}commitments found.`}
        isScrollable={true}
        height="calc(100vh - 16rem)"
      />
    </section>
  );
};
