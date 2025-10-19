export interface FridgeItem {
  id: string; // imageId
  x: number; // percentage coordinates
  y: number;
  width: number;
  height: number;
}

export interface ReceivedImage {
  imageId: string;
  from: string;
  receivedAt: number;
}

export interface UserData {
  name: string;
  isKid: boolean;
  kidEmail: string, 
  kidAccountId: string, 
  customerId: string, 
  balance: number;
  createdImages: string[];
  ownedImages: string[];
  fridge: FridgeItem[];
  receivedImages: ReceivedImage[];
  friends: string[]; // Array of friend UIDs
  friendCode?: string; // Current active 8-character code
  friendCodeExpiry?: number; // Timestamp when code expires (15 min)
  createdAt: number;
}