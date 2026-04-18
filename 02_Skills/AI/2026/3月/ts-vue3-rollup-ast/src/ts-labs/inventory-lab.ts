export type Category = "book" | "toy" | "food";
export type OrderStatus = "pending" | "paid" | "shipped";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: Category;
}

export interface Order {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
}

export type NewOrderInput = Omit<Order, "id" | "totalPrice" | "status">;
export type ProductPatch = Partial<Pick<Product, "name" | "price" | "stock">>;


// 