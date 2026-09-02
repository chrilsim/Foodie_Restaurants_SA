import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

import { Header } from '../header/header';
import { MenuDrawer } from '../../shared/components/menu-drawer/menu-drawer';
import { CartDrawer } from '../../shared/components/cart-drawer/cart-drawer';
import { cartService } from '../../core/cart.service';

import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    MatSidenavModule,
    MenuDrawer,
    CartDrawer
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements AfterViewInit, OnDestroy {

  protected readonly title = signal('Foodie_Restaurants');

  @ViewChild('leftDrawer')
  menuDrawer!: MatSidenav;

  @ViewChild('drawer')
  cartDrawer!: MatSidenav;

  private destroy$ = new Subject<void>();

  constructor(private drawerService: cartService) {}

  ngAfterViewInit(): void {

    this.drawerService.drawer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {

        if (!this.menuDrawer || !this.cartDrawer) {
          return;
        }

        switch (type) {

          case 'menu':
            this.cartDrawer.close();
            this.menuDrawer.open();
            break;

          case 'cart':
            this.menuDrawer.close();
            this.cartDrawer.open();
            break;

          default:
            this.menuDrawer.close();
            this.cartDrawer.close();
            break;
        }

      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}