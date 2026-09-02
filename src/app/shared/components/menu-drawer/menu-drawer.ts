import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogActions } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/auth.service';
import { interfaceuser } from '../../../interface/user';
import { Output, EventEmitter } from '@angular/core';
import { cartService } from '../../../core/cart.service';
import { AddToCartService } from '../../../core/addToCart.service';
import { LocationDialog } from '../../../features/location/location-dialog/location-dialog';
@Component({
  selector: 'app-menu-drawer',
  imports: [MatIconModule, RouterLink],
  templateUrl: './menu-drawer.html',
  styleUrl: './menu-drawer.css',
})
export class MenuDrawer implements OnInit {
  constructor(
    private authService: AuthService,
    private DrawerService: cartService,
    private serviceAddToCart:AddToCartService,
    private drc: ChangeDetectorRef,
    private router:Router,
    private dialog:MatDialog
  ) { }
  close(): void {
    this.DrawerService.close();
    this.drc.detectChanges();
  }

  users: interfaceuser[] = [];
  user: interfaceuser | null = null;
  ngOnInit(): void {

    this.user = this.authService.getUser();
    this.drc.detectChanges();

  }
  logout(): void {

  localStorage.removeItem(
    'token'
  );

  localStorage.removeItem(
    'user'
  );


  this.serviceAddToCart.clearLocalCart();

  this.router.navigate([
    '/login'
  ]);

}
 openLocation() {
    this.dialog.open(LocationDialog, {
      width: '600px',
      disableClose: false,
      panelClass: 'location-dialog'
    });
  }
}
