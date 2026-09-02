import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BookingTableService } from '../../../../core/bookingTable.service';
import { TableService } from '../../../../core/table.service';
import { interfaceuser } from '../../../../interface/user';
import { AuthService } from '../../../../core/auth.service';
import { BookingInvoice } from '../../../../shared/components/booking-invoice/booking-invoice';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
type AreaKey = 'Indoor' | 'Outdoor' | 'vip';

interface SeatingArea {
  id: AreaKey;
  name: string;
  desc: string;
  image: string;
}


interface Table {
  _id: string;
  tableNumber: string;
  seats: number;
  area: 'Indoor' | 'Outdoor' | 'vip';
  status: 'available' | 'occupied';
}
@Component({
  selector: 'app-table-booking',
  imports: [NgClass, CommonModule, BookingInvoice, MatIconModule, MatButtonModule, MatSelectModule, MatInputModule, MatCardModule, ReactiveFormsModule, MatIcon, MatFormField, MatFormFieldModule, MatSelect, MatOption, MatOptgroup, CommonModule],
  templateUrl: './table-booking.html',
  styleUrl: './table-booking.css',
})
export class TableBooking implements OnInit {
  bookingForm!: FormGroup;
  users: interfaceuser[] = [];
  user: interfaceuser = {
    _id: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  }
  tables: Table[] = [];

  selectedParty = 2;
  selectedDate: Date | null = null;
  selectedTime = '';
  selectedTable: Table | null = null;
  selectedArea: AreaKey = 'Indoor';
  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    public bookingService: BookingTableService,
    private tableService: TableService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.bookingForm = this.fb.group({
      fullName: [
        '',
        Validators.required
      ],

      phoneNumber: [
        '',
        Validators.required
      ],
      email: [''],

      specialRequest: ['']

    });
    this.loadTables();


  }

  dates = Array.from( { length: 7 },(_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {

        date,
        label:i === 0? 'ថ្ងៃនេះ': i === 1? 'ថ្ងៃស្អែក' : ''
      };

    }
  );
  morningTimes = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM'
  ];
  afternoonTimes = [
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM'
  ];
  eveningTimes = [
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM'
  ];
  seatingAreas: SeatingArea[] = [
    {
      id: 'Indoor',
      name: 'ក្នុងហាង (Indoor)',
      desc: 'បរិយាកាសម៉ាស៊ីនត្រជាក់',
      image: 'assets/bg.png'
    },
    {
      id: 'Outdoor',
      name: 'ខាងក្រៅ (Outdoor)',
      desc: 'ខ្យល់ធម្មជាតិ',
      image: 'assets/bg.png'
    },
    {
      id: 'vip',
      name: 'បន្ទប់ឯកជន (Private)',
      desc: 'ឯកជនសម្រាប់ក្រុម',
      image: 'assets/bg.png'
    }
  ];
  get selectedSeatingArea() {
    return this.seatingAreas.find(
      area => area.id === this.selectedArea
    );
  }
  loadTables(): void {
    this.tableService.getTables().subscribe({
      next: (res) => {
        this.tables = res.data;
      },
      error: (err) => {
        console.error(
          'Get tables error:',
          err
        );

      }
    });
  }
  get filteredTables(): Table[] {
    return this.tables.filter(
      table =>
        table.area.toLowerCase() ===
        this.selectedArea.toLowerCase()
    );
  }
  setArea(area: AreaKey): void {
    this.selectedArea = area;
    this.selectedTable = null;

  }
selectTable(table: Table): void {

  if (table.status === 'occupied') {
    return;
  }

  // Check seats
  if (this.selectedParty > table.seats) {

    alert(
      `តុនេះមានតែ ${table.seats} កៅអី។ សូមជ្រើសតុធំជាងនេះ។`
    );

    return;
  }

  this.selectedTable = table;
}


  confirmBooking(): void {
    if (!this.selectedDate) {

      alert('សូមជ្រើសរើសថ្ងៃ');

      return;
    }
    if (!this.selectedTime) {
      alert('សូមជ្រើសរើសម៉ោង');
      return;
    }

    if (!this.selectedTable) {
      alert('សូមជ្រើសរើសតុ');
      return;
    }
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      alert(
        'សូមបំពេញព័ត៌មានទំនាក់ទំនង'
      );
      return;
    }

    const bookingData = {
      tableId:
        this.selectedTable._id,

      seatingArea:
        this.selectedArea,

      partySize:
        this.selectedParty,

      bookingDate:
        this.selectedDate,

      bookingTime:
        this.selectedTime,

      fullName:
        this.bookingForm.value.fullName,

      phoneNumber:
        this.bookingForm.value.phoneNumber,

      email:
        this.bookingForm.value.email,

      specialRequest:
        this.bookingForm.value.specialRequest

    };

    this.bookingService.create(bookingData).subscribe({
      next: (res) => { this.router.navigate([ '/my-reservations' ]);
        const booking = res.data;
        this.dialog.open(BookingInvoice, {
          width: '560px', maxWidth: '95vw',  maxHeight: '90vh',
          data: {
            bookingNumber:  booking._id  ? booking._id.slice(-6).toUpperCase(): 'N/A',
            tableNumber: booking.tableId?.tableNumber ?? this.selectedTable?.tableNumber?? 'N/A',
            partySize:booking.partySize,
            bookingDate:booking.bookingDate,
            bookingTime:booking.bookingTime,
            seatingArea: booking.seatingArea,
            fullName: booking.fullName,
            phoneNumber: booking.phoneNumber,
            email:booking.email,
            specialRequest: booking.specialRequest,
            status:  booking.status
          }

        });

        this.bookingForm.reset();
        this.selectedTable = null;
        this.selectedTime = '';
        this.selectedDate = null;
      },
      error: (err) => {
        console.error(
          'Booking Error:',
          err
        );

      }

    });

  }

}
