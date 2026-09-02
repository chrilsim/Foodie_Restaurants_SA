import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BookingTableService } from '../../../core/bookingTable.service';

@Component({
  selector: 'app-admin-booking',

  standalone: true,

  imports: [
    CommonModule,

    FormsModule,

    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],

  templateUrl: './bookin-managerment.html',
  styleUrl: './bookin-managerment.css',
})
export class BookinManagerment implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading = false;
  searchText: string = '';

  selectedStatus: string = 'all';
  selectedArea: string = 'all';

  constructor(
    private bookingService: BookingTableService,
    private drc:ChangeDetectorRef
  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadBookings();

  }


  // ==========================================
  // GET ALL BOOKINGS
  // ==========================================

  loadBookings(): void {

    this.isLoading = true;

    this.bookingService.getAllBookings().subscribe({
        next: (res) => {
          this.bookings =res.data || [];
          this.filteredBookings =[...this.bookings];
          this.applyFilter();
          this.isLoading = false;
          this.drc.detectChanges();
        },
        error: (err) => {
          console.error('Get bookings error:',err);
          this.bookings = [];
          this.filteredBookings = [];
          this.isLoading = false;
           this.drc.detectChanges();
        }
      });

  }


  // ==========================================
  // TOTAL BOOKING
  // ==========================================

  get totalBookings(): number {

    return this.bookings.length;

  }


  // ==========================================
  // COUNT BOOKING BY STATUS
  // ==========================================

  getBookingCount(
    status: string
  ): number {

    return this.bookings.filter(
      booking =>
        booking.status === status
    ).length;

  }


  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  applyFilter(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    this.filteredBookings =
      this.bookings.filter(
        booking => {

          // --------------------------
          // CUSTOMER NAME
          // --------------------------

          const name =
            booking.fullName
            ||
            booking.userId?.fullName
            ||
            '';


          // --------------------------
          // EMAIL
          // --------------------------

          const email =
            booking.email
            ||
            booking.userId?.email
            ||
            '';


          // --------------------------
          // PHONE
          // --------------------------

          const phone =
            booking.phoneNumber
            ||
            '';


          // --------------------------
          // AREA
          // --------------------------

          const area =
            booking.seatingArea
            ||
            '';


          // --------------------------
          // TABLE
          // --------------------------

          const table =
            booking.tableId?.tableNumber
            ||
            '';


          // --------------------------
          // SEARCH
          // --------------------------

          const matchesSearch =
            !search
            ||
            name
              .toString()
              .toLowerCase()
              .includes(search)
            ||
            email
              .toString()
              .toLowerCase()
              .includes(search)
            ||
            phone
              .toString()
              .toLowerCase()
              .includes(search)
            ||
            table
              .toString()
              .toLowerCase()
              .includes(search);


          // --------------------------
          // STATUS
          // --------------------------

          const matchesStatus =
            this.selectedStatus === 'all'
            ||
            booking.status ===
              this.selectedStatus;


          // --------------------------
          // AREA
          // --------------------------

          const matchesArea =
            this.selectedArea === 'all'
            ||
            area === this.selectedArea;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesArea
          );

        }
      );

  }


  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  clearSearch(): void {

    this.searchText = '';

    this.applyFilter();

  }


  // ==========================================
  // RESET FILTER
  // ==========================================

  resetFilter(): void {

    this.searchText = '';

    this.selectedStatus = 'all';

    this.selectedArea = 'all';

    this.filteredBookings =
      [...this.bookings];

  }


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  updateStatus(
    id: string,

    status:
      | 'pending'
      | 'confirmed'
      | 'completed'
      | 'cancelled'

  ): void {

    this.bookingService
      .updateStatus(
        id,
        status
      )
      .subscribe({

        next: (res) => {

          console.log(
            'Status updated:',
            res
          );

          alert(
            `Booking ${status}`
          );

          this.loadBookings();

        },

        error: (err) => {

          console.error(
            'Update status error:',
            err
          );

          alert(
            err.error?.message
            ||
            'Failed to update status'
          );

        }

      });

  }


  // ==========================================
  // CONFIRM
  // ==========================================

  confirmBooking(
    id: string
  ): void {

    this.updateStatus(
      id,
      'confirmed'
    );

  }


  // ==========================================
  // CANCEL
  // ==========================================

  cancelBooking(
    id: string
  ): void {

    if (
      !confirm(
        'Cancel this booking?'
      )
    ) {

      return;

    }


    this.updateStatus(
      id,
      'cancelled'
    );

  }


  // ==========================================
  // COMPLETE
  // ==========================================

  completeBooking(
    id: string
  ): void {

    this.updateStatus(
      id,
      'completed'
    );

  }


  // ==========================================
  // DELETE
  // ==========================================

  deleteBooking(
    id: string
  ): void {

    if (
      !confirm(
        'Delete this booking?'
      )
    ) {

      return;

    }


    this.bookingService
      .deleteBooking(id)
      .subscribe({

        next: () => {

          alert(
            'Booking deleted successfully'
          );

          this.loadBookings();

        },

        error: (err) => {

          console.error(
            'Delete error:',
            err
          );

          alert(
            err.error?.message
            ||
            'Failed to delete booking'
          );

        }

      });

  }

}