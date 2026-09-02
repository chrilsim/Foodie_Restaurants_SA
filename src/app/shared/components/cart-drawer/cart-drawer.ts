import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cartService } from '../../../core/cart.service';
import { CartItem} from '../../../interface/menuitem';
import { AddToCartService} from '../../../core/addToCart.service';
import { UsdToKhrPipe} from '../../pipes/usd-to-khr';
@Component({
  selector: 'app-cart-drawer',
  imports: [
    MatIconModule,
    CommonModule,
    UsdToKhrPipe
  ],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css'
})
export class CartDrawer implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalItem = 0;
  private cartSubscription?: Subscription;
  constructor(
    private cartService: cartService,
    public cartservice: AddToCartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private drc: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cartSubscription =this.cartservice.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.totalItem = items.reduce((total, item) => total + Number(item.quantity), 0);
        this.totalPrice = items.reduce((total, item) =>
          total +
          (
            Number(
              item.finalPrice ??
              item.price
            ) *
            Number(item.quantity)),0
        );
        this.drc.detectChanges();
      });

    this.cartservice.loadCart();
  }
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
  close(): void {
    this.cartService.close();
  }

  increase(item: CartItem): void {
    if (!item.cartItemId) {
      return;
    }
    this.cartservice.increaseQty(item.cartItemId
    );
    this.drc.detectChanges();

  }
  decrease(item: CartItem): void {
    if (!item.cartItemId) {
      return;
    }
    this.cartservice.decreaseQty(item.cartItemId);

  }
  remove(item: CartItem): void {
    if (!item.cartItemId) {
      return;
    }
    this.cartservice.removeItem(
      item.cartItemId
    );
    this.drc.detectChanges();
  }

  getItemTotal(item: CartItem): number {
    return (
      Number(item.finalPrice ??item.price) *
      Number(item.quantity)
    );
  }
  checkout(): void {
    const token =localStorage.getItem('token');
    if (!token) {
      const snack =this.snackBar.open('⚠️ Please login before checkout',
          'Login',
          {
            duration: 3000,
            horizontalPosition:'center',
            verticalPosition:'top'
          }

        );
      snack.onAction().subscribe(() => {
          this.router.navigate(
            ['/login']
          );
        });
      return;
    }
    this.close();
    this.router.navigate(['/products/checkout']);

  }

}