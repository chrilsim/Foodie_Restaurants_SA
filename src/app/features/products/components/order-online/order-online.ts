import { CommonModule } from '@angular/common';
import { Component ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-online',
  imports: [CommonModule,MatIconModule],
  templateUrl: './order-online.html',
  styleUrl: './order-online.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderOnline {}
