import {
  Component,
  Inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';
import { Order } from '../../../interface/order.interface';

@Component({

  selector:
    'app-order-detail-dialog',

  standalone: true,

  imports: [

    CommonModule,

    MatDialogModule,

    MatIconModule,

    MatButtonModule

  ],

  templateUrl:
    './order-detail-dialog.html',

  styleUrl:
    './order-detail-dialog.css'

})
export class OrderDetailDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public order: Order
  ) {}

  getItemCount(): number {

    return this.order.items.reduce(
      (total, item) =>
        total + Number(item.quantity),
      0
    );

  }

  getItemTotal(
    price: number,
    quantity: number
  ): number {

    return price * quantity;

  }

  formatDate(
    date: string
  ): string {

    return new Date(date)
      .toLocaleString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      );

  }

  getPaymentText(
    payment: string
  ): string {

    switch (payment) {

      case 'cash':
        return 'Cash';

      case 'aba':
        return 'ABA Pay';

      case 'card':
        return 'Card';

      default:
        return payment;

    }

  }

}