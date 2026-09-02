import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/order.service';
import { Router } from '@angular/router';
import { Order } from '../../../interface/order.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSpinner } from '@angular/material/progress-spinner';
import { OrderDetailDialog } from '../order-detail-dialog/order-detail-dialog';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-my-order',
  imports: [ 
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSpinner,
    MatProgressBarModule],
  templateUrl: './my-order.html',
  styleUrl: './my-order.css',
})
export class MyOrder implements OnInit {

  orders: Order[] = [];
  isLoading = false;

  errorMessage = '';

  constructor(
    private orderService:OrderService,
    private router:Router,
    private drc:ChangeDetectorRef,
     private dialog: MatDialog
  ) {}


  ngOnInit(): void {

    this.loadOrders();

  }
  loadOrders(): void {

    const token =localStorage.getItem('token');
    if (!token) {
      this.errorMessage ='សូម Login ជាមុនសិន';
      return;

    }

    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders().subscribe({
        next: (response) => {
          this.orders =response.orders || [];
          this.isLoading =false;
          this.drc.detectChanges();

        },
        error: (err) => {

          console.error(
            'GET ORDERS ERROR:',
            err
          );

          this.isLoading =false;
          this.orders = [];
          this.errorMessage =err.error?.message ||'មិនអាចទាញយក Order បានទេ';
        }

      });

  }
viewOrder(order: Order): void {
  this.dialog.open(
    OrderDetailDialog,
    {
      width: '650px',
      maxWidth: '95vw',
      maxHeight: '90vh',

      data: order,
      
    }
    
  );

}
  getItemCount(
    order: Order
  ): number {

    return order.items.reduce(

      (total, item) =>
        total +
        Number(item.quantity),

      0

    );

  }
  formatDate(date: string): string {
    return new Date(date).toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }
  getStatusClass(
    status: string
  ): string {

    return status
      .toLowerCase();

  }
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

      case 'Delivering':
        return 'delivery_dining';

      case 'Completed':
        return 'done_all';

      case 'Cancelled':
        return 'cancel';

      default:
        return 'info';

    }

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
