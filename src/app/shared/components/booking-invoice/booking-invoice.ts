import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-booking-invoice',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './booking-invoice.html',
  styleUrl: './booking-invoice.css',
})
export class BookingInvoice {
   constructor(
    private dialogRef: MatDialogRef<BookingInvoice>,

    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  printInvoice(): void {
    window.print();
  }
  
}
