export interface BoughtByEntry {
  from: string;
  amount: number;
  timestamp: number;
}

export interface ImageData {
  url: string;
  ownerId: string;
  createdAt: number;
  boughtBy: BoughtByEntry[];
  width: number;
  height: number;
}