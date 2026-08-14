import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DrawerService } from '../../../core/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  imports: [MatIconModule,RouterLink],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css',
})
export class CartDrawer {

  constructor(private DrawerService:DrawerService){}
  close():void{
     this.DrawerService.close();
  }
}
