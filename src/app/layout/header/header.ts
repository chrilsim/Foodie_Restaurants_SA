import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";
import { DrawerService } from '../../core/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { LocationDialog } from '../../features/location/location-dialog/location-dialog';
@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private DrawerService: DrawerService,private dialog: MatDialog){}


openLocation() {
  this.dialog.open(LocationDialog, {
    width: '600px',
    disableClose: false,
    panelClass: 'location-dialog'
  });
}
 openMenu() {
    this.DrawerService.open('menu');
  }

  openCart() {
    this.DrawerService.open('cart');
  }
}
