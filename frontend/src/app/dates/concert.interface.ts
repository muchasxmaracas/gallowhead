// Define the data interfaces
export interface Concert {
    date: string;
    venue: string;
    info: string;
    // 'active' is used for UI state (accordion open/closed)
    active: boolean; 
    city: string;
    country: string;
    lineup: string;
    tickets: string;
  }
  
  // Defines the structure of the data returned from the Google Sheets API proxy
  export interface SheetResponse {
    values: string[][];
    // Optional metadata from the proxy/Sheets API
    range?: string;
    majorDimension?: string;
  }
  