import {
  Component,
  Inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';


@Component({

  selector:
    'app-order-products-dialog',

  standalone: true,

  imports: [

    CommonModule,

    MatIconModule,

    MatButtonModule

  ],

  templateUrl:
    './order-products-dialog.html',

  styleUrl:
    './order-products-dialog.css'

})


export class OrderProductsDialog {


  order: any;


  constructor(

    private dialogRef:
      MatDialogRef<OrderProductsDialog>,

    @Inject(MAT_DIALOG_DATA)
    public data: any

  ) {

    this.order =
      data?.order || {};

  }

  getTotalItems(): number {

    if (
      !this.order?.items
    ) {

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

  getSubtotal(
    item: any
  ): number {

    return Number(
      item?.subtotal ??
      (
        Number(item?.price || 0) *
        Number(item?.quantity || 1)
      )
    );

  }


  getTotal(): number {

    if (
      !this.order?.items
    ) {

      return 0;

    }


    return this.order.items.reduce(

      (
        total: number,
        item: any
      ) => {

        return total +
          this.getSubtotal(item);

      },

      0

    );

  }


  close(): void {

    this.dialogRef.close();

  }

}