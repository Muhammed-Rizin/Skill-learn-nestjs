export interface Payment {
  from: string;
  to: string;
  paymentId: string;
  amount: number;
  createdAt: Date;
}
