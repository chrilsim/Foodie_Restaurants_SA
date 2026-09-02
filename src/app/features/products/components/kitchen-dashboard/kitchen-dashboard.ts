import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  OrderService
} from '../../../../core/order.service';


@Component({
  selector: 'app-kitchen-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],

  templateUrl:
    './kitchen-dashboard.html',

  styleUrl:
    './kitchen-dashboard.css'
})
export class KitchenDashboard
  implements OnInit {


  // ==========================================
  // ORDERS
  // ==========================================

  orders: any[] = [];


  // ==========================================
  // LOADING
  // ==========================================

  isLoading = false;


  // ==========================================
  // ACTION LOADING
  // ==========================================

  actionLoading: {
    [key: string]: boolean
  } = {};


  constructor(

    private orderService:
      OrderService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadOrders();

  }


  // ==========================================
  // LOAD KITCHEN ORDERS
  // ==========================================

  loadOrders(): void {

    if (this.isLoading) {
      return;
    }


    this.isLoading = true;


    this.orderService
      .getKitchenOrders()
      .subscribe({

        next: (response: any) => {

          console.log(
            'KITCHEN ORDERS:',
            response
          );


          this.orders =
            response?.orders || [];


          this.isLoading =
            false;


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'GET KITCHEN ORDERS ERROR:',
            error
          );


          this.orders = [];


          this.isLoading =
            false;


          alert(
            error?.error?.message ||
            'Failed to load kitchen orders'
          );


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // CONFIRM ORDER
  // ==========================================

  confirmOrder(
    order: any
  ): void {

    if (
      this.isActionLoading(
        order._id
      )
    ) {

      return;

    }


    this.actionLoading[
      order._id
    ] = true;


    this.orderService
      .confirmOrder(
        order._id
      )
      .subscribe({

        next: (
          response: any
        ) => {

          console.log(
            'CONFIRM SUCCESS:',
            response
          );


          order.status =
            'Confirmed';


          this.actionLoading[
            order._id
          ] = false;


          this.cdr.detectChanges();

        },


        error: (
          error: any
        ) => {

          console.error(
            'CONFIRM ERROR:',
            error
          );


          this.actionLoading[
            order._id
          ] = false;


          alert(
            error?.error?.message ||
            'Confirm Order failed'
          );


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // START PREPARING
  // ==========================================

  startPreparing(
    order: any
  ): void {

    if (
      this.isActionLoading(
        order._id
      )
    ) {

      return;

    }


    this.actionLoading[
      order._id
    ] = true;


    this.orderService
      .startPreparing(
        order._id
      )
      .subscribe({

        next: (
          response: any
        ) => {

          console.log(
            'PREPARING SUCCESS:',
            response
          );


          order.status =
            'Preparing';


          this.actionLoading[
            order._id
          ] = false;


          this.cdr.detectChanges();

        },


        error: (
          error: any
        ) => {

          console.error(
            'PREPARING ERROR:',
            error
          );


          this.actionLoading[
            order._id
          ] = false;


          alert(
            error?.error?.message ||
            'Start Preparing failed'
          );


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // MARK READY
  // ==========================================

  markReady(order: any): void {if (this.isActionLoading(order._id)) {
      return;
    }
    this.actionLoading[order._id] = true;
    this.orderService.markReady(order._id).subscribe({
        next: (response: any) => {console.log('READY SUCCESS:',response);
          /*
           * Remove from Kitchen
           * because /kitchen only returns:
           *
           * Pending
           * Confirmed
           * Preparing
           */

          this.orders =this.orders.filter(item =>item._id !== order._id);
          this.actionLoading[order._id] = false;
          this.cdr.detectChanges();
          /*
           * Optional refresh
           */
          setTimeout(() => {
            this.loadOrders();
          }, 300);
        },
        error: (error: any) => {console.error('READY ERROR:',error);
          this.actionLoading[order._id] = false;
          alert(error?.error?.message ||'Mark Ready failed');
          this.cdr.detectChanges();
        }

      });

  }
  isActionLoading(orderId: string): boolean {
    return !!this.actionLoading[orderId];
  }
  getItemCount(
    order: any
  ): number {
    if (
      !order?.items
    ) {

      return 0;

    }

    return order.items.reduce(
      (
        total: number,
        item: any
      ) => {

        return (
          total +
          Number(
            item.quantity || 0
          )
        );

      },

      0

    );

  }

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'Pending':
        return 'status-pending';

      case 'Confirmed':
        return 'status-confirmed';

      case 'Preparing':
        return 'status-preparing';

      case 'Ready':
        return 'status-ready';

      default:
        return '';

    }

  }


  // ==========================================
  // STATUS ICON
  // ==========================================

  getStatusIcon(
    status: string
  ): string {

    switch (status) {

      case 'Pending':
        return 'schedule';

      case 'Confirmed':
        return 'check_circle';

      case 'Preparing':
        return 'restaurant';

      case 'Ready':
        return 'done_all';

      default:
        return 'receipt_long';

    }

  }

}