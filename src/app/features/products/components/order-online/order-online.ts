import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-order-online',
  imports: [CommonModule, MatIconModule],
  templateUrl: './order-online.html',
  styleUrl: './order-online.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
@ViewChild('menuBar')
export class OrderOnline {
  @ViewChild('menuBar')
  menuBar!: ElementRef<HTMLDivElement>;

  scrollLeft() {
    this.menuBar.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.menuBar.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }
}
