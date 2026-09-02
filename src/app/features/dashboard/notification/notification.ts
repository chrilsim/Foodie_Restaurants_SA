import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../../core/notification.service";
import {
  ChangeDetectorRef,
  Component,
  Inject,
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



@Component({

  selector:
    'app-notification-dialog',

  standalone: true,

  imports: [

    CommonModule,

    MatIconModule,

    MatButtonModule

  ],

  templateUrl:
    './notification.html',

  styleUrl:
    './notification.css'
})
export class Notification implements OnInit {

  notifications: any[] = [];

  unreadCount = 0;

  isLoading = false;


  constructor(

    private notificationService:
      NotificationService,

    private dialogRef:
      MatDialogRef<Notification>,

    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private drc: ChangeDetectorRef

  ) { }


  ngOnInit(): void {

    this.loadNotifications();

  }

  loadNotifications(): void {

    this.isLoading = true;


    this.notificationService
      .getNotifications()
      .subscribe({

        next: (res) => {

          this.notifications =
            res?.data || [];

          this.updateUnreadCount();

          this.isLoading = false;
          this.drc.detectChanges();
        },

        error: (err) => {

          console.error(
            'GET NOTIFICATIONS ERROR:',
            err
          );

          this.notifications = [];

          this.unreadCount = 0;

          this.isLoading = false;
          this.drc.detectChanges();
        }

      });

  }


  updateUnreadCount(): void {

    this.unreadCount =
      this.notifications.filter(
        notification =>
          !notification.isRead
      ).length;

  }
  markAsRead(
    notification: any
  ): void {

    if (

      !notification?._id ||

      notification.isRead

    ) {

      return;

    }


    this.notificationService
      .markAsRead(
        notification._id
      )
      .subscribe({

        next: () => {

          notification.isRead =
            true;

          this.updateUnreadCount();

        },

        error: (err) => {

          console.error(
            'MARK READ ERROR:',
            err
          );

        }

      });

  }
  markAllAsRead(): void {

    if (this.unreadCount === 0) {
      return;
    }

    this.notificationService.markAllAsRead().subscribe({
        next: () => {
          this.notifications =this.notifications.map(
              notification => ({
                ...notification,
                isRead: true
              })
            );
          this.unreadCount = 0;
        },

        error: (err) => {
          console.error(
            'MARK ALL READ ERROR:',
            err
          );

        }

      });

  }

  deleteNotification(notification: any, event: Event): void {
    event.stopPropagation();
    if (!notification?._id) {
      return;
    }
    this.notificationService.deleteNotification(notification._id)
      .subscribe({
        next: () => {

          this.notifications =
            this.notifications.filter(
              item =>item._id !==notification._id
            );
          this.updateUnreadCount();
        },

        error: (err) => {

          console.error(
            'DELETE NOTIFICATION ERROR:',
            err
          );

        }

      });

  }


  getIcon(
    type: string
  ): string {

    switch (type) {

      case 'new_order':
        return 'receipt_long';

      case 'new_booking':
        return 'event_seat';

      case 'low_stock':
        return 'warning';

      case 'out_of_stock':
        return 'error';

      case 'order_ready':
        return 'restaurant';

      case 'delivery_update':
        return 'two_wheeler';

      case 'payment_received':
        return 'payments';

      default:
        return 'notifications';

    }

  }


  getTime(
    date: string
  ): string {

    if (!date) {

      return '';

    }


    const created =
      new Date(date);

    const now =
      new Date();


    const diff =
      now.getTime() -
      created.getTime();


    const minutes =
      Math.floor(
        diff / 60000
      );


    if (minutes < 1) {

      return 'Just now';

    }


    if (minutes < 60) {

      return `${minutes} min ago`;

    }


    const hours =Math.floor(minutes / 60);
    if (hours < 24) {

      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }


    const days =
      Math.floor(
        hours / 24
      );

    return `${days} day${days > 1 ? 's' : ''} ago`;

  }

  viewAll(): void {

    this.dialogRef.close(
      'view-all'
    );

  }

  close(): void {

    this.dialogRef.close();

  }

}