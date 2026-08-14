import { Component, signal ,ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Header } from '../header/header';
import { MenuDrawer } from '../../shared/components/menu-drawer/menu-drawer';
import { CartDrawer } from '../../shared/components/cart-drawer/cart-drawer';
import { DrawerService } from '../../core/cart.service';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    Header,
    MatSidenavModule,
    CartDrawer,
    MenuDrawer
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
   protected readonly title = signal('Foodie_Restaurants');
  @ViewChild('leftDrawer')
menuDrawer!: MatSidenav;

@ViewChild('drawer')
cartDrawer!: MatSidenav;

  constructor(
    private drawerService: DrawerService
  ) { }

  ngAfterViewInit(): void {

    this.drawerService.drawer$.subscribe(type => {

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

      }

    });

  }

}
