import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from "@angular/router";
import { cartService } from '../../core/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { LocationDialog } from '../../features/location/location-dialog/location-dialog';
import { AddToCartService } from '../../core/addToCart.service';
import { NgClass } from '@angular/common';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [MatIconModule, AsyncPipe,MatFormFieldModule, MatInputModule, RouterLink, NgClass],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  TotalItem$!: Observable<number>;

  constructor(private DrawerService: cartService,
    private dialog: MatDialog,
    public cartservice: AddToCartService,
    private drc: ChangeDetectorRef,
    private router: Router
  ) { }
  isSearchPage = false;
  TotalItem = 0;
  ngOnInit(): void {

    this.TotalItem$ = this.cartservice.totalItem$;
    this.checkSearchPage();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.checkSearchPage();
      });
  }
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
  goToSearch() {
    this.router.navigate(['/products/search']);
  }

  checkSearchPage(): void {
    this.isSearchPage =
      this.router.url.startsWith('/products/search');
  }

}
