import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SettingsService } from '../../../core/settings.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-settings',

  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    CommonModule,
    RouterLink
],

  templateUrl: './settings.html',

  styleUrl: './settings.css'

})


export class Settings implements OnInit {

  selectedSetting = 'general';
  restaurantName = '';

  phone = '';

  email = '';

  address = '';

  openingTime = '08:00';

  closingTime = '22:00';

  currency: 'USD' | 'KHR' = 'USD';

  timezone = 'Asia/Phnom_Penh';
  theme:
    'light' | 'dark' | 'system' = 'light';

  language:
    'km' | 'en' = 'km';

  dashboardLayout:
    'compact' | 'comfortable' = 'comfortable';

  sidebarCollapsed = false;
  restaurantOpen = true;

  acceptOnlineOrders = true;

  acceptBookings = true;

  defaultPreparationTime = 15;

  maximumBookingGuests = 20;

  minimumOrderAmount = 0;
  autoConfirmOrders = false;

  allowTakeaway = true;

  allowDelivery = true;

  deliveryFee = 0;

  isLoading = false;

  isSaving = false;

  paymentMethods = {

    cash: true,

    aba: true,

    card: false,

    khqr: true

  };

  abaAccountName = '';
  abaAccountNumber = '';
  khqrMerchantName = '';

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {

    this.loadSettings();

  }

  loadSettings(): void {

    this.isLoading = true;
    this.applyAppearance();

    this.settingsService
      .getSettings()
      .subscribe({

        next: (response) => {

          console.log(
            'SETTINGS DATA:',
            response
          );


          const data =
            response.data;

          this.restaurantName =
            data.restaurantName || '';

          this.phone =
            data.phone || '';

          this.email =
            data.email || '';

          this.address =
            data.address || '';

          this.openingTime =
            data.openingTime || '08:00';

          this.closingTime =
            data.closingTime || '22:00';

          this.currency =
            data.currency || 'USD';

          this.timezone =
            data.timezone ||
            'Asia/Phnom_Penh';

          this.restaurantOpen =
            data.restaurantOpen ?? true;

          this.acceptOnlineOrders =
            data.acceptOnlineOrders ?? true;

          this.acceptBookings =
            data.acceptBookings ?? true;

          this.defaultPreparationTime =
            data.defaultPreparationTime ?? 15;

          this.maximumBookingGuests =
            data.maximumBookingGuests ?? 20;

          this.minimumOrderAmount =
            data.minimumOrderAmount ?? 0;

          this.autoConfirmOrders =
            data.autoConfirmOrders ?? false;

          this.allowTakeaway =
            data.allowTakeaway ?? true;

          this.allowDelivery =
            data.allowDelivery ?? true;

          this.deliveryFee =
            data.deliveryFee ?? 0;

          this.paymentMethods = {

            cash:
              data.paymentMethods?.cash ?? true,

            aba:
              data.paymentMethods?.aba ?? true,

            card:
              data.paymentMethods?.card ?? false,

            khqr:
              data.paymentMethods?.khqr ?? true

          };


          this.abaAccountName =
            data.abaAccountName || '';


          this.abaAccountNumber =
            data.abaAccountNumber || '';


          this.khqrMerchantName =
            data.khqrMerchantName || '';


          this.theme =
            data.theme ?? 'light';

          this.language =
            data.language ?? 'km';

          this.dashboardLayout =
            data.dashboardLayout ?? 'comfortable';

          this.sidebarCollapsed =
            data.sidebarCollapsed ?? false;

          this.isLoading = false;

        },


        error: (error) => {

          console.error(
            'GET SETTINGS ERROR:',
            error
          );

          this.isLoading = false;

        }

      });

  }

  saveAppearanceSettings(): void {

    this.isSaving = true;

    const settings = {

      theme:
        this.theme,

      language:
        this.language,

      dashboardLayout:
        this.dashboardLayout,

      sidebarCollapsed:
        this.sidebarCollapsed

    };

    this.settingsService
      .updateSettings(settings)
      .subscribe({

        next: (response) => {

          console.log(
            'APPEARANCE SAVED:',
            response.data
          );

          this.isSaving = false;

          this.applyAppearance();

          alert(
            'Appearance settings saved successfully!'
          );

        },

        error: (error) => {

          console.error(
            'APPEARANCE SETTINGS ERROR:',
            error
          );

          this.isSaving = false;

          alert(
            error?.error?.message ||
            'Failed to save appearance settings'
          );

        }

      });

  }
  applyAppearance(): void {

    const body =
      document.body;

    body.classList.remove(
      'theme-light',
      'theme-dark'
    );

    if (this.theme === 'system') {

      const dark =
        window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;


      body.classList.add(
        dark
          ? 'theme-dark'
          : 'theme-light'
      );

    }

    else {

      body.classList.add(
        this.theme === 'dark'
          ? 'theme-dark'
          : 'theme-light'
      );

    }

  }
  saveGeneralSettings(): void {

    this.isSaving = true;


    const settings = {

      restaurantName:
        this.restaurantName.trim(),

      phone:
        this.phone.trim(),

      email:
        this.email.trim(),

      address:
        this.address.trim(),

      openingTime:
        this.openingTime,

      closingTime:
        this.closingTime,

      currency:
        this.currency,

      timezone:
        this.timezone

    };


    this.settingsService
      .updateSettings(settings)
      .subscribe({

        next: (response) => {

          console.log(
            'GENERAL SETTINGS SAVED:',
            response.data
          );

          this.isSaving = false;

          alert(
            'General settings saved successfully!'
          );

        },


        error: (error) => {

          console.error(
            'SAVE GENERAL SETTINGS ERROR:',
            error
          );

          this.isSaving = false;

          alert(
            error?.error?.message ||
            'Failed to save general settings'
          );

        }

      });

  }
  saveRestaurantSettings(): void {

    this.isSaving = true;


    const settings = {

      restaurantOpen:
        this.restaurantOpen,

      acceptOnlineOrders:
        this.acceptOnlineOrders,

      acceptBookings:
        this.acceptBookings,

      defaultPreparationTime:
        Number(
          this.defaultPreparationTime
        ),

      maximumBookingGuests:
        Number(
          this.maximumBookingGuests
        ),

      minimumOrderAmount:
        Number(
          this.minimumOrderAmount
        )

    };


    this.settingsService
      .updateSettings(settings)
      .subscribe({

        next: (response) => {

          console.log(
            'RESTAURANT SETTINGS SAVED:',
            response.data
          );

          this.isSaving = false;

          alert(
            'Restaurant settings saved successfully!'
          );

        },


        error: (error) => {

          console.error(
            'SAVE RESTAURANT SETTINGS ERROR:',
            error
          );

          this.isSaving = false;

          alert(
            error?.error?.message ||
            'Failed to save restaurant settings'
          );

        }

      });

  }
  savePaymentSettings(): void {

    this.isSaving = true;


    const settings = {

      paymentMethods: {

        cash:
          this.paymentMethods.cash,

        aba:
          this.paymentMethods.aba,

        card:
          this.paymentMethods.card,

        khqr:
          this.paymentMethods.khqr

      },

      abaAccountName:
        this.abaAccountName.trim(),

      abaAccountNumber:
        this.abaAccountNumber.trim(),

      khqrMerchantName:
        this.khqrMerchantName.trim()

    };


    this.settingsService
      .updateSettings(settings)
      .subscribe({

        next: (response) => {

          console.log(
            'PAYMENT SETTINGS SAVED:',
            response.data
          );

          this.isSaving = false;

          alert(
            'Payment settings saved successfully!'
          );

        },

        error: (error) => {

          console.error(
            'PAYMENT SETTINGS ERROR:',
            error
          );

          this.isSaving = false;

          alert(
            error?.error?.message ||
            'Failed to save payment settings'
          );

        }

      });

  }

  saveOrderSettings(): void {

    this.isSaving = true;


    const settings = {

      autoConfirmOrders:
        this.autoConfirmOrders,

      allowTakeaway:
        this.allowTakeaway,

      allowDelivery:
        this.allowDelivery,

      deliveryFee:
        Number(
          this.deliveryFee
        )

    };


    this.settingsService
      .updateSettings(settings)
      .subscribe({

        next: (response) => {

          console.log(
            'ORDER SETTINGS SAVED:',
            response.data
          );

          this.isSaving = false;

          alert(
            'Order settings saved successfully!'
          );

        },


        error: (error) => {

          console.error(
            'SAVE ORDER SETTINGS ERROR:',
            error
          );

          this.isSaving = false;

          alert(
            error?.error?.message ||
            'Failed to save order settings'
          );

        }

      });

  }
  selectSetting(
    setting: string
  ): void {

    this.selectedSetting =
      setting;

  }

}