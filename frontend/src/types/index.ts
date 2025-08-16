export interface InvestorApi {
    id: number;
    investor_name: string;
    investor_type: string;
    investor_country: string;
    investor_date_added: string;      
    total_commitment: number;         // In GBP, e.g., 3492000000
  }

  
  export interface CommitmentApi {
    id: number;
    asset_class: string;
    amount: number;
    currency: string;
  }

  
  export type AssetClass = string;
