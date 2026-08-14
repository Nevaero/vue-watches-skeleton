export type Watch = {
  id: number;
  brand: string;
  model: string;
  priceEur: number;
  stock: number;
};

export type CartItem = {
  watch: Watch;
  quantity: number;
};
