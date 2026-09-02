import {OrderItem} from './order-item.interface';

import { Addressinterface } from './address';

export interface Order {

  _id: string;

  userId: string;

  items: OrderItem[];

  totalAmount: number;

  receiveType:
    | 'delivery'
    | 'pickup';

  deliveryAddress:
    | string
    | Addressinterface;

  paymentMethod:
    | 'cash'
    | 'aba'
    | 'card';

  paymentStatus:
    | 'Unpaid'
    | 'Paid'
    | 'Failed';

  status:
    | 'Pending'
    | 'Confirmed'
    | 'Preparing'
    | 'Delivering'
    | 'Completed'
    | 'Cancelled';

  createdAt: string;

  updatedAt?: string;

}