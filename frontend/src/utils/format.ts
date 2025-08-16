// utils.ts
// Format number to currency, e.g., 3492000000 => "3.5B"
export function formatCommitment(amount: number): string {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)}B`;
    } else if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(0)}M`;
    }
    return amount.toString();
  }
  
  // Format ISO date to "Month DD, YYYY"
  export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  