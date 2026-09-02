import { Component, signal ,ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import {  cartService } from './core/cart.service';
import { CartDrawer } from './shared/components/cart-drawer/cart-drawer';
import { MenuDrawer } from './shared/components/menu-drawer/menu-drawer';
import{Layout} from './layout/layout/layout';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MatSidenavModule,
    CartDrawer, RouterOutlet, MenuDrawer, Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Foodie_Restaurants');
 
}

