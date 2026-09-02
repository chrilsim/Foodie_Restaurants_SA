import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  of
} from 'rxjs';

import { tap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import {
  interfaceitemenu,
  CartItem,
  SelectedMenuOption
} from '../interface/menuitem';


@Injectable({
  providedIn: 'root'
})
export class AddToCartService {


  private apiUrl = 'http://localhost:3000/api/cart';

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  totalItem$ = this.cartItems$.pipe(
    map(items =>
      items.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      )
    )
  );
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) { }

  private isLoggedIn(): boolean {

    const token =
      localStorage.getItem('token');

    return !!token;

  }


  private getGuestCart(): CartItem[] {

    const cart = localStorage.getItem('guestCart');
    if (!cart) {
      return [];
    }

    try {

      return JSON.parse(cart);

    } catch (error) {

      console.error(
        'GUEST CART PARSE ERROR:',
        error
      );

      return [];

    }

  }


  private saveGuestCart(
    cart: CartItem[]
  ): void {

    localStorage.setItem(
      'guestCart',
      JSON.stringify(cart)
    );

    this.cartItemsSubject.next(cart);

  }

  loadCart(): void {

    if (!this.isLoggedIn()) {

      const guestCart =
        this.getGuestCart();

      this.cartItemsSubject.next(
        guestCart
      );

      return;
    }


    this.http.get<any>(
      this.apiUrl
    )
      .subscribe({
        next: response => {
          const items =response?.items ?? [];
          const cartItems: CartItem[] = items
            .filter(
              (item: any) =>
                item.productId
            )
            .map((item: any) => {
                const product =item.productId;
                return {
                  _id:
                    product._id ?? '',
                  cartItemId:item._id ?? '',

                  categoryId:
                    product.categoryId ?? '',

                  name:
                    product.name ?? '',

                  description:
                    product.description ?? '',

                  price:
                    Number(product.price ?? 0),

                  cost:
                    Number(product.cost ?? 0),

                  image:
                    product.image ?? '',

                  stock:
                    Number(product.stock ?? 0),

                  hasStock:
                    product.hasStock ?? false,

                  isAvailable:
                    product.isAvailable ?? true,

                  options:
                    product.options ?? [],

                  preparationTime:
                    product.preparationTime,

                  kitchenNote:
                    product.kitchenNote,

                  isFeatured:
                    product.isFeatured,

                  isPopular:
                    product.isPopular,

                  quantity:
                    Number(item.quantity ?? 1),

                  selectedOptions:
                    item.selectedOptions ?? [],

                  finalPrice:
                    Number(
                      item.finalPrice ??
                      product.price ??
                      0
                    )

                } as CartItem;

              }
            );


          this.cartItemsSubject.next(
            cartItems
          );

        },


        error: err => {

          console.error(
            'LOAD CART ERROR:',
            err
          );

        }

      });

  }


  addToCart(
    item: interfaceitemenu,
    quantity: number = 1,
    selectedOptions: SelectedMenuOption[] = []
  ): void {

    if (!item?._id) {

      console.error(
        'Product ID missing'
      );

      return;
    }



    if (!this.isLoggedIn()) {

      const cart =
        this.getGuestCart();


      const existingItem =
        cart.find(x =>
          x._id === item._id
        );


      if (existingItem) {

        const newQuantity =
          existingItem.quantity + quantity;


        if (
          existingItem.hasStock &&
          newQuantity > existingItem.stock
        ) {

          this.snackBar.open(
            `Only ${existingItem.stock} items available`,
            'Close',
            {
              duration: 3000
            }
          );

          return;
        }


        existingItem.quantity =
          newQuantity;

      }

      else {

        const optionPrice =
          selectedOptions.reduce(
            (total, option) =>
              total +
              Number(option.price || 0),
            0
          );


        const finalPrice =
          Number(item.price || 0) +
          optionPrice;


        cart.push({

          ...item,

          quantity,

          selectedOptions:
            [...selectedOptions],

          finalPrice

        });

      }


      this.saveGuestCart(cart);

      return;
    }



    const body = {

      productId:
        item._id,

      quantity:
        quantity,

      selectedOptions:
        selectedOptions

    };
    this.http.post<any>(
      `${this.apiUrl}/add`,
      body
    )
      .subscribe({

        next: response => {

          this.loadCart();


          this.snackBar.open(
            `✅ ${item.name} added to cart`,
            'View Cart',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );

        },


        error: err => {

          console.error(
            'ADD CART ERROR:',
            err
          );


          this.snackBar.open(
            err.error?.message ||
            'Failed to add item to cart',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );

        }

      });

  }


  mergeGuestCart():
    Observable<any> {


    const guestCart =
      this.getGuestCart();

    if (!guestCart.length) {

      return of({

        success: true,

        message:
          'No guest cart'

      });

    }

    const requests =guestCart.map(
        item => {
          const selectedOptions =
            item.selectedOptions ?? [];


          const optionsPrice =
            selectedOptions.reduce(
              (
                total,
                option
              ) =>
                total +
                Number(
                  option.price ?? 0
                ),
              0
            );


          const finalPrice =
            Number(item.price ?? 0) +
            optionsPrice;


          return this.http
            .post<any>(
              `${this.apiUrl}/add`,
              {

                productId:
                  item._id,

                quantity:
                  item.quantity,

                selectedOptions:
                  selectedOptions,

                finalPrice:
                  finalPrice

              }
            );

        }

      );


    return forkJoin(
      requests
    ).pipe(

      tap(
        responses => {

          console.log(
            'GUEST CART MERGED:',
            responses
          );


          // Remove guest cart

          localStorage.removeItem(
            'guestCart'
          );


          // Load DB cart

          this.loadCart();

        }
      )

    );

  }


 

  updateQty(
    cartItemId: string,
    quantity: number
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/item/${cartItemId}`,
      {
        quantity
      }
    );

  }


  increaseQty(cartItemId: string): void {


    const item =
      this.cartItemsSubject.value.find(
        x => x.cartItemId === cartItemId
      );

    if (!item) {
      console.error(
        'Cart Item ID missing:',
        cartItemId
      );
      return;
    }

    console.log(
      'BEFORE:',
      item.quantity
    );

    const newQuantity =
      item.quantity + 1;

    console.log(
      'AFTER:',
      newQuantity
    );

    this.updateQty(
      cartItemId,
      newQuantity
    ).subscribe({

      next: response => {

        console.log(
          '✅ UPDATE SUCCESS'
        );

        this.loadCart();

      },

      error: error => {

        console.error(
          '❌ UPDATE ERROR:',
          error
        );

      }

    });

  }
  // =====================================================
  // DECREASE
  // =====================================================

  decreaseQty(
    cartItemId: string
  ): void {

    const item =
      this.cartItemsSubject.value.find(
        x =>
          x.cartItemId === cartItemId
      );


    if (!item) {
      return;
    }


    // ===============================
    // REMOVE
    // ===============================

    if (item.quantity <= 1) {

      this.removeItem(
        cartItemId
      );

      return;

    }


    const newQuantity =
      item.quantity - 1;


    // ===============================
    // GUEST
    // ===============================

    if (!this.isLoggedIn()) {

      const cart =
        this.getGuestCart();


      const cartItem =
        cart.find(
          x =>
            x.cartItemId === cartItemId
        );


      if (cartItem) {

        cartItem.quantity =
          newQuantity;

        this.saveGuestCart(cart);

      }


      return;
    }


    // ===============================
    // DATABASE
    // ===============================

    this.updateQty(
      cartItemId,
      newQuantity
    )
      .subscribe({

        next: response => {

          console.log(
            'DECREASE SUCCESS:',
            response
          );

          this.loadCart();

        },

        error: error => {

          console.error(
            'DECREASE ERROR:',
            error
          );

          this.showError(
            error.error?.message ||
            'Cannot decrease quantity'
          );

        }

      });

  }

  // =====================================================
  // DELETE CART ITEM
  // =====================================================

  deleteCartItem(
    cartItemId: string
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/item/${cartItemId}`
    );

  }


  // =====================================================
  // REMOVE ITEM
  // =====================================================

  removeItem(
    cartItemId: string
  ): void {

    // ===============================
    // GUEST
    // ===============================

    if (!this.isLoggedIn()) {

      const cart =
        this.getGuestCart();


      const newCart =
        cart.filter(
          item =>
            item.cartItemId !== cartItemId
        );


      this.saveGuestCart(
        newCart
      );


      return;
    }


    // ===============================
    // DATABASE
    // ===============================

    this.deleteCartItem(
      cartItemId
    )
      .subscribe({

        next: response => {
          this.loadCart();

        },

        error: error => {

          console.error(
            'REMOVE ITEM ERROR:',
            error
          );

          this.showError(
            error.error?.message ||
            'Cannot remove item'
          );

        }

      });

  }

  // =====================================================
  // GET TOTAL ITEM
  // =====================================================

  getTotalItem(): number {

    return this.cartItemsSubject
      .value
      .reduce(

        (
          total,
          item
        ) =>

          total +
          Number(
            item.quantity
          ),

        0

      );

  }


  // =====================================================
  // GET TOTAL PRICE
  // =====================================================

  getTotalPrice(): number {

    return this.cartItemsSubject
      .value
      .reduce(

        (
          total,
          item
        ) =>

          total +

          (
            Number(
              item.finalPrice ??
              item.price ??
              0
            ) *

            Number(
              item.quantity
            )
          ),

        0

      );

  }


  // =====================================================
  // CLEAR CART
  // =====================================================

  clearCart():
    Observable<any> {

    if (!this.isLoggedIn()) {

      this.clearLocalCart();

      return of({
        success: true
      });

    }


    return this.http
      .delete<any>(
        this.apiUrl
      )
      .pipe(

        tap(() => {

          this.cartItemsSubject.next(
            []
          );

        })

      );

  }


  // =====================================================
  // CLEAR LOCAL CART
  // =====================================================

  clearLocalCart(): void {

    localStorage.removeItem(
      'guestCart'
    );

    this.cartItemsSubject.next(
      []
    );

  }


  // =====================================================
  // GET CURRENT CART
  // =====================================================

  getCartItems():
    CartItem[] {

    return this.cartItemsSubject
      .value;

  }


  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  private showSuccess(
    message: string
  ): void {

    this.snackBar.open(
      `✅ ${message}`,
      'View Cart',
      {

        duration: 3000,

        horizontalPosition:
          'right',

        verticalPosition:
          'top',

        panelClass:
          [
            'cart-success-snackbar'
          ]

      }

    );

  }


  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  private showError(
    message: string
  ): void {

    this.snackBar.open(
      `❌ ${message}`,
      'Close',
      {

        duration: 3000,

        horizontalPosition:
          'right',

        verticalPosition:
          'top'

      }

    );

  }

}