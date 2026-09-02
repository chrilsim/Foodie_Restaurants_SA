import { Injectable } from '@angular/core';
import { API_URL } from '../API_URL';
import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';



export interface DashboardResponse {

  success: boolean;

  data: DashboardData;

}


export interface DashboardData {

  statistics: {

    totalOrders: number;

    todayOrders: number;

    todayRevenue: number;

    todayBookings: number;

    totalMenu: number;

    availableMenu: number;

    unavailableMenu: number;

    popularMenu: number;

    lowStock: number;

    outOfStock: number;

    activeDeliveries: number;

    totalCustomers: number;

    totalStaff: number;

    totalRiders: number;
    

  };

 dailyProfit: {
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  };
  revenue: {

    today: number;

    week: number;

    month: number;

  };

  orderStatus: {

    pending: number;

    confirmed: number;

    preparing: number;

    ready: number;

    delivering: number;

    completed: number;

    cancelled: number;

  };



  revenueChart: RevenueChart[];



  popularProducts:
    PopularProduct[];


  inventoryAlerts:
    any[];


  todayBookings:
    any[];

  tableStatus: {

    total: number;

    available: number;

    occupied: number;

    maintenance: number;

  };


  liveDeliveries:
    any[];


  paymentOverview: {

    cash: number;

    aba: number;

    card: number;

    unpaid: number;

  };


  recentOrders:
    any[];

}



export interface RevenueChart {

  date: string;

  orders: number;

  revenue: number;

}



export interface PopularProduct {

  productId: string;

  productName: string;

  quantity: number;

  revenue: number;

}


@Injectable({

  providedIn: 'root'

})


export class DashboardService {


  private apiUrl =`${API_URL}/dashboard`;



  constructor(
    private http: HttpClient
  ) {}


  getDashboardSummary():

    Observable<DashboardResponse> {

    return this.http.get<DashboardResponse>(

      `${this.apiUrl}/summary`

    );

  }

}