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
  MatTooltipModule
} from '@angular/material/tooltip';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  FormsModule
} from '@angular/forms';

import {
  OrderService
} from '../../../core/order.service';

import {
  RiderDeliveryService
} from '../../../core/rider-delivery.service';

import {
  OrderViewDialog
} from '../order-view-dialog/order-view-dialog';
import { OrderProductsDialog } from '../order-products-dialog/order-products-dialog';


@Component({
  selector: 'app-order',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule
  ],

  templateUrl: './order.html',

  styleUrl: './order.css'
})
export class Order implements OnInit {


  orders: any[] = [];

  filteredOrders: any[] = [];

  searchText = '';

  selectedStatus = 'All';

  statuses = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Delivering',
    'Completed',
    'Cancelled'
  ];


  isLoading = false;


  constructor(

    private orderService: OrderService,

    private deliveryService:
      RiderDeliveryService,

    private dialog: MatDialog,

    private drc: ChangeDetectorRef

  ) { }


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadOrders();

  }


  // ==========================================
  // LOAD ORDERS
  // ==========================================

  loadOrders(): void {

    this.isLoading = true;

    this.orderService
      .getAllOrders()
      .subscribe({

        next: (response) => {

          this.orders =response?.data || [];
          this.filteredOrders =[...this.orders];
          this.applyFilter();
          this.isLoading = false;
          this.drc.detectChanges();

        },
        error: (error) => {
          console.error(
            'GET ORDERS ERROR:',
            error
          );

          this.orders = [];
          this.filteredOrders = [];
          this.isLoading = false;

        }

      });

  }

  applyFilter(): void {

    const search =this.searchText
        .trim()
        .toLowerCase();


    this.filteredOrders =
      this.orders.filter((order: any) => {
          const matchesSearch =
            !search ||
            order._id
              ?.toLowerCase()
              .includes(search) ||

            order.userId?.fullName
              ?.toLowerCase()
              .includes(search) ||

            order.userId?.email
              ?.toLowerCase()
              .includes(search);


          const matchesStatus =
            this.selectedStatus === 'All' ||

            order.status ===
            this.selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

  }


  clearSearch(): void {

    this.searchText = '';

    this.applyFilter();

  }

  getItemCount(
    order: any
  ): number {

    if (!order?.items) {

      return 0;

    }

    return order.items.reduce(
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


  getOrderNumber(
    id: string
  ): string {

    if (!id) {

      return '#--------';

    }

    return '#' +
      id
        .slice(-8)
        .toUpperCase();

  }



  viewOrder(
    order: any
  ): void {

    this.openOrderDialog(
      order,
      'order'
    );

  }


  viewCustomer(
    order: any
  ): void {

    this.openOrderDialog(
      order,
      'customer'
    );

  }


  viewAddress(
    order: any
  ): void {

    this.openOrderDialog(
      order,
      'address'
    );

  }

  viewProducts(order: any): void {

    this.dialog.open(
      OrderProductsDialog,
      {

        width: '620px',

        maxWidth: '95vw',

        maxHeight: '90vh',

        panelClass:
          'order-products-dialog-panel',

        data: {

          order

        }

      }

    );

  }


  viewPayment(
    order: any
  ): void {

    this.openOrderDialog(
      order,
      'payment'
    );

  }


  viewRider(
    order: any
  ): void {

    this.openOrderDialog(
      order,
      'rider'
    );

  }

  getTodayTotal(): number {

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );


    const tomorrow =
      new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );


    return this.orders
      .filter((order: any) => {

        if (!order.createdAt) {
          return false;
        }

        const orderDate =
          new Date(order.createdAt);

        return (
          orderDate >= today &&
          orderDate < tomorrow
        );

      })
      .reduce(
        (
          total: number,
          order: any
        ) => {

          return total +
            Number(
              order.totalPrice ||
              order.total ||
              order.grandTotal ||
              0
            );

        },
        0
      );

  }

  openOrderDialog(

    order: any,

    viewType:
      | 'order'
      | 'customer'
      | 'address'
      | 'payment'
      | 'rider'

  ): void {


    if (
      viewType === 'rider'
    ) {

      this.deliveryService
        .getDeliveryByOrder(
          order._id
        )
        .subscribe({

          next: (response) => {

            console.log(
              'DELIVERY:',
              response
            );

            this.showDialog(
              order,
              viewType,
              response?.data || null
            );

          },

          error: (error) => {

            console.log(
              'NO DELIVERY:',
              error
            );

            this.showDialog(
              order,
              viewType,
              null
            );

          }

        });

      return;

    }
    this.showDialog(
      order,
      viewType,
      null
    );

  }

  private showDialog(

    order: any,

    viewType:
      | 'order'
      | 'customer'
      | 'address'
      | 'payment'
      | 'rider',

    delivery: any

  ): void {

    this.dialog.open(
      OrderViewDialog,
      {

        width: '760px',

        maxWidth: '95vw',

        maxHeight: '90vh',

        panelClass:
          'order-view-dialog-panel',

        data: {

          order,

          viewType,

          delivery

        }

      }
    );

  }

}