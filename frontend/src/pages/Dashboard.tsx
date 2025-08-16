import React, { useState, useEffect } from "react";
import { InvestorsTable } from "../components/InvestorTable";
import { CommitmentsTable } from "../components/CommitmentsTable";

import type { InvestorApi, CommitmentApi, AssetClass } from "../types";

const Dashboard: React.FC = () => {
  const [investors, setInvestors] = useState<InvestorApi[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorApi | null>(null);
  const [commitments, setCommitments] = useState<CommitmentApi[]>([]);
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [commitmentsLoading, setCommitmentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        
        // Fetch investors only initially
        const investorsResponse = await fetch(`${API_BASE_URL}/investors/`);
        if (!investorsResponse.ok) {
          throw new Error(`Failed to fetch investors: ${investorsResponse.status}`);
        }
        const investorsData = await investorsResponse.json();
        setInvestors(investorsData.data); // Extract the 'data' array

      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // Function to fetch commitments for a specific investor
  const fetchInvestorCommitments = async (investorId: number) => {
    try {
      setCommitmentsLoading(true);
      setError(null);
      
      const commitmentsResponse = await fetch(`${API_BASE_URL}/investors/${investorId}/commitments`);
      if (!commitmentsResponse.ok) {
        throw new Error(`Failed to fetch commitments: ${commitmentsResponse.status}`);
      }
      const commitmentsData = await commitmentsResponse.json();
      setCommitments(commitmentsData.commitments);
      setAssetClasses(commitmentsData.asset_classes);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching commitments:", err);
    } finally {
      setCommitmentsLoading(false);
    }
  };

  // Function to handle investor selection
  const handleInvestorSelect = (investor: InvestorApi) => {
    setSelectedInvestor(investor);
    fetchInvestorCommitments(investor.id);
  };

  // Function to go back to investors list
  const handleBackToInvestors = () => {
    setSelectedInvestor(null);
    setCommitments([]);
    setAssetClasses([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-200 flex flex-col">
      <div className="container mx-auto px-12 py-12 flex-1 flex flex-col bg-white">
        <main className="flex-1 flex flex-col">
          {!selectedInvestor ? (
            // Show investors list
            <div className="flex flex-col h-full">
              <div className="mb-6 flex-shrink-0">
                <h2 className="text-2xl font-semibold text-gray-900 text-left">Investors</h2>
              </div>
              <div className="flex-1">
                <InvestorsTable 
                  investors={investors} 
                  onInvestorSelect={handleInvestorSelect}
                />
              </div>
            </div>
          ) : (
            // Show commitments for selected investor
            <div className="flex-1 flex flex-col">
              {commitmentsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading commitments...</p>
                </div>
              ) : (
                <CommitmentsTable 
                  commitments={commitments} 
                  assetClasses={assetClasses}
                  investorName={selectedInvestor.investor_name}
                  onBackToInvestors={handleBackToInvestors}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
