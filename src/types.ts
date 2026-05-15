export interface Place {
  name: string;
  category: string;
  address: string;
  description: string;
  phone?: string;
  hours?: string;
  rating: number;
  lat: number;
  lng: number;
}

export interface SearchResponse {
  results: Place[];
  aiMessage: string;
  total: number;
}
