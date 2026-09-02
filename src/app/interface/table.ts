export interface Tableinterface {
  _id: string;
  tableNumber: string;
  seats: number;
  area: 'indoor' | 'terrace' | 'vip';
   status: 'selected' | 'available' | 'occupied' | 'maintenance';

}