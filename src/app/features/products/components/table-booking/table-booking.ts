import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
type AreaKey = 'indoor' | 'terrace' | 'vip';

interface SeatingArea {
  id: AreaKey;
  name: string;
  desc: string;
  image: string;
}
interface Table {
  id: string;
  seats: number;
  status: 'available' | 'occupied' | 'selected';
  x: number;
  y: number;
}
@Component({
  selector: 'app-table-booking',
  imports: [NgClass, CommonModule, MatIcon],
  templateUrl: './table-booking.html',
  styleUrl: './table-booking.css',
})
export class TableBooking {

  selectedParty=2;
  selectedDate: Date | null = null;
  dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return {
      date,
      label: i === 0 ? 'ថ្ងៃនេះ' : i === 1 ? 'ថ្ងៃស្អែក' : ''
    };
  });
 selectedTime = '';
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
 selectedArea: AreaKey = 'indoor';
   seatingAreas: SeatingArea[] = [
    {
      id: 'indoor',
      name: 'ក្នុងហាង (Indoor)',
      desc: 'បរិយាកាសម៉ាស៊ីនត្រជាក់',
      image: 'assets/bg.png'
    },
    {
      id: 'terrace',
      name: 'ខាងក្រៅ (Terrace)',
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
  return this.seatingAreas.find(area => area.id === this.selectedArea);
}
  areas: Record<AreaKey, Table[]> = {
    indoor: [
      { id: 'T-01', seats: 2, status: 'available', x: 20, y: 80 },
      { id: 'T-02', seats: 4, status: 'available', x: 120, y: 80 },
      { id: 'T-03', seats: 4, status: 'available', x: 220, y: 80 },
      { id: 'T-04', seats: 4, status: 'available', x: 450, y: 80 },
      { id: 'T-05', seats: 4, status: 'occupied', x: 550, y: 80 },
      { id: 'T-05', seats: 4, status: 'occupied', x: 650, y: 80 },
      { id: 'T-01', seats: 2, status: 'available', x: 20, y: 180 },
      { id: 'T-02', seats: 4, status: 'available', x: 120, y: 180 },
      { id: 'T-03', seats: 4, status: 'available', x: 220, y: 180 },
      { id: 'T-04', seats: 4, status: 'available', x: 450, y: 180 },
      { id: 'T-05', seats: 4, status: 'occupied', x: 550, y: 180 },
      { id: 'T-05', seats: 4, status: 'occupied', x: 650, y: 180 },
    ],

    terrace: [
      { id: 'T-01', seats: 2, status: 'available', x: 50, y: 60 },
      { id: 'T-02', seats: 4, status: 'occupied', x: 250, y: 120 }
    ],

    vip: [
      { id: 'V-01', seats: 8, status: 'available', x: 150, y: 100 },
      { id: 'V-02', seats: 10, status: 'selected', x: 450, y: 100 }
    ]
  };

  get tables(): Table[] {
    return this.areas[this.selectedArea];
  }

  setArea(area: AreaKey) {
    this.selectedArea = area;
  }
   selectedTable: Table | null = null;
  selectTable(table: Table) {

    // មិនអនុញ្ញាតឱ្យជ្រើសតុដែលមានភ្ញៀវ
    if (table.status === 'occupied') {
      return;
    }

    // ដក selected ចេញពីតុចាស់
    if (this.selectedTable) {
      this.selectedTable.status = 'available';
    }

    // ជ្រើសតុថ្មី
    table.status = 'selected';
    this.selectedTable = table;
  }
}
