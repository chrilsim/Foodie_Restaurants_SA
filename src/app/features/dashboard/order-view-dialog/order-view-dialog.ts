import {
  Component,
  Inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';


@Component({
  selector: 'app-order-view-dialog',

  standalone: true,

  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],

  templateUrl:
    './order-view-dialog.html',

  styleUrl:
    './order-view-dialog.css'
})
export class OrderViewDialog {


  order: any;

  delivery: any;

  viewType:
    | 'order'
    | 'customer'
    | 'address'
    | 'payment'
    | 'rider';


  constructor(

    private dialogRef:MatDialogRef<OrderViewDialog>,

    @Inject(MAT_DIALOG_DATA) public data: any

  ) {

    this.order =data?.order;
    this.delivery =data?.delivery;
    this.viewType =data?.viewType || 'order';

  }
  close(): void {

    this.dialogRef.close();

  }


  getTitle(): string {

    switch (
      this.viewType
    ) {

      case 'customer':
        return 'Customer Information';

      case 'address':
        return 'Delivery Address';

      case 'payment':
        return 'Payment Information';

      case 'rider':
        return 'Rider Information';

      default:
        return 'Order Details';

    }

  }

  getIcon(): string {

    switch (
      this.viewType
    ) {

      case 'customer':
        return 'person';

      case 'address':
        return 'location_on';

      case 'payment':
        return 'payments';

      case 'rider':
        return 'two_wheeler';

      default:
        return 'receipt_long';

    }

  }

  getStatusClass(
    status: string
  ): string {

    if (!status) {

      return '';

    }

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');

  }

  getItemCount(): number {

    if (!this.order?.items) {

      return 0;

    }

    return this.order.items.reduce(
      (
        total: number,
        item: any
      ) => {

        return total +
          Number(
            item.quantity || 1
          );

      },
      0
    );

  }

  getItemsSubtotal(): number {

    if (!this.order?.items) {

      return 0;

    }

    return this.order.items.reduce(
      (
        total: number,
        item: any
      ) => {

        return total +
          Number(
            item.subtotal || 0
          );

      },
      0
    );

  }

}