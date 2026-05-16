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
  imageUrl?: string;
  distance?: number; // Distance en km depuis la position de l'utilisateur
}

export interface SearchResponse {
  results: Place[];
  aiMessage: string;
  total: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'new_place' | 'favorite_update' | 'promo';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  placeId?: string;
  icon?: string;
}
