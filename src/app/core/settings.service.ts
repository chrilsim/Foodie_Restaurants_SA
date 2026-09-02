import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';
import { API_URL } from '../API_URL';

export interface RestaurantSettings {

  _id?: string;

  restaurantName: string;

  phone: string;

  email: string;

  address: string;

  openingTime: string;

  closingTime: string;

  currency: 'USD' | 'KHR';

  timezone: string;

  restaurantOpen?: boolean;

  acceptOnlineOrders?: boolean;

  acceptBookings?: boolean;

  defaultPreparationTime?: number;

  maximumBookingGuests?: number;

  minimumOrderAmount?: number;

  autoConfirmOrders?: boolean;

  allowTakeaway?: boolean;

  allowDelivery?: boolean;

  deliveryFee?: number;
  paymentMethods?: {

  cash: boolean;

  aba: boolean;

  card: boolean;

  khqr: boolean;

};

abaAccountName?: string;

abaAccountNumber?: string;

khqrMerchantName?: string;
theme?: 'light' | 'dark' | 'system';

language?: 'km' | 'en';

dashboardLayout?: 'compact' | 'comfortable';

sidebarCollapsed?: boolean;

}

export interface SettingsResponse {

  success: boolean;

  message?: string;

  data: RestaurantSettings;

}


@Injectable({
  providedIn: 'root'
})


export class SettingsService {

   private apiUrl =
    `${API_URL}/settings`;


  constructor(
    private http: HttpClient
  ) {}


  getSettings():
    Observable<SettingsResponse> {

    return this.http.get<SettingsResponse>(
      this.apiUrl
    );

  }


 updateSettings(
  settings: Partial<RestaurantSettings>
) {

  return this.http.put<SettingsResponse>(
    this.apiUrl,
    settings
  );

}

}