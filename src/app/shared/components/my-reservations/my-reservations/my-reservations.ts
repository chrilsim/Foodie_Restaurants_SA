import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { MatIcon } from '@angular/material/icon';

import { BookingTableService }
  from '../../../../core/bookingTable.service';

import { BookingInvoice }
  from '../../booking-invoice/booking-invoice';
import { MatSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-my-reservations',

  standalone: true,

  imports: [
    CommonModule,
    MatIcon,MatSpinner
  ],

  templateUrl:
    './my-reservations.html',

  styleUrl:
    './my-reservations.css'
})
export class MyReservations implements OnInit {
  bookings: any[] = [];
  isLoading = false;

  constructor(
    private bookingService:BookingTableService,
    private drc:ChangeDetectorRef,
    private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }
  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
        next: (res) => {
          this.bookings =res.data || [];
          this.isLoading = false;
         this.drc.detectChanges();
        },
        error: (err) => {console.error('Get My Bookings Error:',err);
          this.isLoading = false;
            this.drc.detectChanges();
        }
      });
  }
  viewInvoice(
    booking: any
  ): void {

    this.dialog.open(
      BookingInvoice,
      {

        width: '560px',

        maxWidth: '95vw',

        maxHeight: '90vh',

        data: {

          bookingNumber:
            booking._id
              ? booking._id
                  .slice(-6)
                  .toUpperCase()
              : 'N/A',


          tableNumber:
            booking.tableId
              ?.tableNumber
              || 'N/A',


          partySize:
            booking.partySize,


          bookingDate:
            booking.bookingDate,


          bookingTime:
            booking.bookingTime,


          seatingArea:
            booking.seatingArea,


          fullName:
            booking.fullName,


          phoneNumber:
            booking.phoneNumber,


          email:
            booking.email
            || '',


          specialRequest:
            booking.specialRequest
            || '',


          status:
            booking.status

        }

      }
    );

  }


  cancelBooking(
  booking: any
): void {


  if (
    booking.status !== 'pending'
  ) {

    alert(
      'ការកក់នេះមិនអាច Cancel បានទេ'
    );

    return;

  }


  const confirmCancel =
    confirm(
      'តើអ្នកពិតជាចង់ Cancel ការកក់តុនេះមែនទេ?'
    );


  if (!confirmCancel) {

    return;

  }



  this.bookingService
    .cancelBooking(
      booking._id
    )
    .subscribe({

      next: (res) => {

  
        const index =
          this.bookings.findIndex(
            item =>
              item._id ===
              booking._id
          );


        if (index !== -1) {

          this.bookings[index] = {

            ...this.bookings[index],

            status: 'cancelled'

          };

        }

        this.drc.detectChanges();


        alert(
          'Booking cancelled successfully'
        );

      },


      error: (err) => {

        console.error(
          'Cancel Booking Error:',
          err
        );


        alert(
          err.error?.message ||
          'Failed to cancel booking'
        );

      }

    });

}

}