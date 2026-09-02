import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
  selector: 'app-kitchen',
  imports: [MatCardModule,MatButtonModule,MatIconModule,MatProgressBarModule],
  templateUrl: './kitchen.html',
  styleUrl: './kitchen.css',
})
export class Kitchen {
  newOrders = [
  {
    id: 402,
    table: 'T-12',
    time: '12:45',
    items: [
      {
        name: '2x Wagyu Beef Burger',
        note: 'NO ONIONS, RARE'
      }
    ]
  },
  {
    id: 405,
    table: 'T-15',
    time: '04:12',
    items: [
      {
        name: '1x Pepperoni Feast',
        note: 'EXTRA SPICY'
      }
    ]
  }
];

preparingOrders = [
  {
    id: 398,
    table: 'T-02',
    time: '18:30',
    items: [
      {
        name: '1x Grilled Salmon'
      }
    ]
  }
];

readyOrders = [
  {
    id: 395,
    table: 'T-09',
    items: [
      {
        name: '4x Classic Carbonara'
      }
    ]
  }
];
}
