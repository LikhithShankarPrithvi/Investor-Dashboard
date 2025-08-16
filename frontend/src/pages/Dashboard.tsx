import React, { useState, useEffect } from "react";
import { InvestorsTable } from "../components/InvestorTable";
import { CommitmentsTable } from "../components/CommitmentsTable";
import { formatCommitment, formatDate } from "../utils/format";
import type { InvestorApi, CommitmentApi, AssetClass } from "../types";

const Dashboard: React.FC = () => {
  const [investors, setInvestors] = useState<InvestorApi[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorApi | null>(null);
  const [commitments, setCommitments] = useState<CommitmentApi[]>([]);
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [commitmentsLoading, setCommitmentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:8000"; // Update this to match your backend URL

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <main className="space-y-12">
          {!selectedInvestor ? (
            // Show investors list
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 text-left">Investors</h2>
              </div>
              <InvestorsTable 
                investors={investors} 
                onInvestorSelect={handleInvestorSelect}
              />
            </>
          ) : (
            // Show commitments for selected investor
            <>
              <div className="mb-6">
                <button
                  onClick={handleBackToInvestors}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors"
                >
                  ← Back to Investors
                </button>
              </div>
              
              {commitmentsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading commitments...</p>
                </div>
              ) : (
                <>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedInvestor.investor_name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <p><span className="font-semibold">Type:</span> {selectedInvestor.investor_type}</p>
                      <p><span className="font-semibold">Country:</span> {selectedInvestor.investor_country}</p>
                      <p><span className="font-semibold">Date Added:</span> {formatDate(selectedInvestor.investor_date_added)}</p>
                      <p><span className="font-semibold">Total Commitment:</span> <span className="text-violet-700 font-bold">{formatCommitment(selectedInvestor.total_commitment)}</span></p>
                    </div>
                  </div>
                  
                  <CommitmentsTable 
                    commitments={commitments} 
                    assetClasses={assetClasses}
                    investorName={selectedInvestor.investor_name}
                  />
                  
                  <footer className="mt-16 text-center text-gray-500">
                    <p>Total Commitments: {commitments.length}</p>
                  </footer>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
