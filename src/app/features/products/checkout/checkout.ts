import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Success } from '../../../shared/components/success/success';
import { AddToCartService } from '../../../core/addToCart.service';
import { OrderService } from '../../../core/order.service';
import { CartItem } from '../../../interface/menuitem';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Addressinterface } from '../../../interface/address';
import { AddressService } from '../../../core/address.service';
import { MatOptgroup } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CheckoutData } from '../../../interface/checkout.interface';
import { LocationDialog } from '../../location/location-dialog/location-dialog';
import { AddAddressDialog } from '../../location/add-address-dialog/add-address-dialog';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  imports: [MatIcon, CommonModule, MatCardModule, MatCard, MatRadioModule, MatIconModule, MatButtonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalItem = 0;
  addresses: Addressinterface[] = [];
  selectedAddress: Addressinterface | null = null;
  deliveryFee = 0;
  selectedReceiveType: 'delivery' | 'pickup' = 'delivery';

  selectedPayment: 'cash' | 'aba' | 'card' = 'cash';
  isLoading = false;
  private cartSubscription?: Subscription;
  constructor(

    private cartService: AddToCartService,
    private dialog: MatDialog,
    private orderService: OrderService,
    private addressService: AddressService,
    private router: Router,
    private drc:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cartSubscription =this.cartService.cartItems$.subscribe((items) => {
          this.cartItems = items;
          this.totalPrice = items.reduce((total, item) =>total + Number(item.price) * Number(item.quantity), 0);
          this.totalItem = items.reduce(
            (total, item) =>
              total +
              Number(item.quantity),

            0
          );


          this.calculateDeliveryFee();

        });

    this.cartService.loadCart();
    this.loadAddresses();

  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();

  }

  loadAddresses(): void {
    this.addressService.getAddresses().subscribe({
        next: (data) => {
          this.addresses = data || [];
          this.selectedAddress =this.addresses.find(address => address.isDefault === true) || this.addresses[0] ||null;
            this,this.drc.detectChanges();
        },

        error: (err) => {

          console.error(
            'GET ADDRESS ERROR:',
            err
          );


          this.addresses = [];

          this.selectedAddress = null;

        }

      });

  }

  addAddress(): void {

    const dialogRef =
      this.dialog.open(
        AddAddressDialog,
        {
          width: '500px',
          maxWidth: '95vw'
        }
      );

    dialogRef.afterClosed().subscribe((result) => {

      if (!result) {
        return;
      }
      console.log(
        'NEW ADDRESS:',
        result
      );


      this.loadAddresses();

    });

  }

  useCurrentLocation(): void {

    if (!navigator.geolocation) {

      alert(
        'Browser របស់អ្នកមិន Support Location ទេ'
      );

      return;

    }

    this.isLoading = true;
    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        this.isLoading = false;

        const dialogRef =
          this.dialog.open(
            AddAddressDialog,
            {

              width: '500px',

              maxWidth: '95vw',

              data: {

                latitude:
                  latitude,

                longitude:
                  longitude

              }

            }
          );
        dialogRef.afterClosed().subscribe((result) => {
          if (!result) {
            return;
          }
          console.log(
            'NEW ADDRESS FROM LOCATION:',
            result
          );

          this.loadAddresses();

          if (result._id) {

            this.selectedAddress =
              result;

          }

        });

      },


      (error) => {

        this.isLoading = false;
        console.error(
          'LOCATION ERROR:',
          error
        );

        switch (error.code) {

          case 1:

            alert(
              'សូមអនុញ្ញាត Location ក្នុង Browser ជាមុនសិន'
            );

            break;


          case 2:

            alert(
              'មិនអាចរកទីតាំងបច្ចុប្បន្នបានទេ'
            );

            break;


          case 3:

            alert(
              'ការរកទីតាំងចំណាយពេលយូរ'
            );

            break;


          default:

            alert(
              'មិនអាចរកទីតាំងបានទេ'
            );

        }

      },

      {

        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0

      }

    );

  }


  selectReceiveType(type: 'delivery' | 'pickup'): void {
    this.selectedReceiveType = type;
    this.calculateDeliveryFee();
  }
  calculateDeliveryFee(): void {

    if (this.selectedReceiveType === 'pickup') {
    this.deliveryFee = 0;
      return;
    }
    this.deliveryFee = 1;

  }

  selectAddress(
    address: Addressinterface
  ): void {

    this.selectedAddress =address;

  }


  selectAddressById(
    id: string
  ): void {

    const address =
      this.addresses.find(
        item =>
          item._id === id
      );
    if (!address) {
      return;
    }
    this.selectedAddress =address;
  }


  getGrandTotal(): number {
    return (
      this.totalPrice +
      this.deliveryFee
    );

  }

  getItemTotal(
    item: CartItem
  ): number {

    return (

      Number(item.price) *

      Number(item.quantity)

    );

  }

  selectPayment(payment: 'cash' | 'aba' | 'card'): void {
    this.selectedPayment = payment;
  }
  placeOrder(): void {
    if (this.isLoading) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {

      alert('សូម Login ជាមុនសិន ដើម្បីបញ្ជាទិញ');

      return;
    }

    if (this.cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (this.selectedReceiveType === 'delivery' && !this.selectedAddress?._id) {
      alert('សូមជ្រើសរើសអាសយដ្ឋានដឹកជញ្ជូន');
      return;
    }
    const orderData = {
      addressId: this.selectedAddress?._id || null,
      receiveType: this.selectedReceiveType,
      paymentMethod: this.selectedPayment
    };

    this.isLoading = true;

    this.orderService.checkout(orderData).subscribe({
      next: (response) => {
       
        this.isLoading = false;alert('✅ បញ្ជាទិញបានជោគជ័យ');
        this.cartService.loadCart();

        // this.router.navigate([
        //   '/orders'
        // ]);

      },
      error: (err) => {

        console.error(
          'ORDER ERROR:',
          err
        );

        this.isLoading = false;
        alert(
          err.error?.message ||'បញ្ជាទិញមិនបានសម្រេច'
        );

      }

    });

  }


  openLocation(): void {

    this.useCurrentLocation();

  }

}