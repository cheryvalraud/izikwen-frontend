export type Position = {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

export type Portfolio = {
  totalValue: number;
  cashBalance: number;
  positions: Position[];
};
