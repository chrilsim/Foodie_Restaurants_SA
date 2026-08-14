import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { Success } from '../../../shared/components/success/success';
@Component({
  selector: 'app-checkout',
  imports: [MatIcon],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
    constructor(private dialog: MatDialog){}
  openLocation() {
    this.dialog.open(Success, {
      width: '600px',
      disableClose: false,
      panelClass: 'Success-dialog'
    });
  }
}
