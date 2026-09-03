import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {CommonModule} from '@angular/common';
import {
  DashboardService,
  DashboardData,
  RevenueChart,
  PopularProduct
} from '../../../core/dashboard.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector:'app-dashboard',
  standalone:true,
  imports: [CommonModule, MatIconModule],
  templateUrl:'./dashboard.html',
  styleUrl:'./dashboard.css'

})
export class Dashboard implements OnInit {
  dashboard: DashboardData | null = null;
  isLoading = false;
  errorMessage = '';
  lastUpdated: Date | null = null;
  selectedRevenuePeriod: 'today' | 'week' | 'month' = 'today';
  constructor(
    private dashboardService: DashboardService,
    private drc: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.loadDashboard();
  }
  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.dashboardService.getDashboardSummary().subscribe({
      next: (response) => {
        if (response && response.success) {
          this.dashboard = response.data;
          this.lastUpdated = new Date();
        }
        else {
          this.errorMessage = 'Failed to load dashboard data';
        }
        this.isLoading = false;
        this.drc.detectChanges();
      },
      error:
        (error) => {
          console.error(
            'DASHBOARD ERROR:',
            error
          );
          this.dashboard = null;
          this.errorMessage = error?.error?.message || 'Unable to load dashboard';
          this.isLoading = false;
          this.drc.detectChanges();
        }
    });
  }
  get revenue() {
    return (
      this.dashboard?.revenue ||
      {
        today: 0,
        week: 0,
        month: 0
      }
    );

  }
  refreshDashboard(): void {
    this.loadDashboard();
  }

  setRevenuePeriod(
    period:
      'today' |
      'week' |
      'month'
  ): void {
    this.selectedRevenuePeriod = period;

  }
  get currentRevenue(): number {
    if (!this.dashboard) {
      return 0;
    }
    switch (this.selectedRevenuePeriod) {
      case 'week':
        return Number(
          this.dashboard.revenue.week ||
          0
        );
      case 'month':
        return Number(
          this.dashboard.revenue.month ||
          0
        );
      default:

        return Number(
          this.dashboard.revenue.today ||
          0
        );

    }

  }

  formatMoney(value: number): string {
    return Number(value || 0).toLocaleString('en-US',
      {
        minimumFractionDigits:2,maximumFractionDigits:2
      }
    );

  }
  get revenueChart():RevenueChart[] {
    return (
      this.dashboard
        ?.revenueChart ||
      []
    );
  }
  get dailyProfit() {
    return this.dashboard?.dailyProfit || {
      revenue: 0,
      cost: 0,
      profit: 0
    };
  }
  get maxRevenue():
    number {
    if (this.revenueChart.length === 0) {
      return 0;
    }
    return Math.max(...this.revenueChart.map(item =>Number(item.revenue || 0)));

  }
  getChartHeight(revenue: number ): number {
    const max =this.maxRevenue;
    if (max <= 0) {
      return 0;
    }
    return (Number(revenue || 0) /max) * 100;
  }
  formatChartDate(date: string): string {
    if (!date) {
      return '';
    }
    const parsed =new Date(date);
    if (Number.isNaN(parsed.getTime())
    ) {
      return date;
    }
    return parsed.toLocaleDateString('en-US',
      {
        weekday:'short'
      }
    );

  }
  get popularProducts():PopularProduct[] {
    return (
      this.dashboard
        ?.popularProducts ||
      []
    );
  }
  getProductRank(index: number): string {
    return String(
      index + 1
    );

  }
  get orderStatus() {
    return (

      this.dashboard?.orderStatus ||
      {
        pending:0,
        confirmed:0,
        preparing:0,
        ready:0,
        delivering:0,
        completed:0,
        cancelled:0
      }
    );
  }
  get activeOrders():number {
    const status =this.orderStatus;
    return (
      status.pending +status.confirmed +status.preparing +status.ready +status.delivering
    );
  }
  get completionRate():number {
    const status =this.orderStatus;
    const total =status.pending +status.confirmed +status.preparing +status.ready +status.delivering +status.completed + status.cancelled;
    if (total === 0) {
      return 0;
    }
    return Math.round((status.completed /total) * 100
    );
  }
  get inventoryAlerts():any[] {
    return (
      this.dashboard?.inventoryAlerts ||[]
    );

  }
  isOutOfStock( item: any ): boolean {
    return Number(item?.quantity || 0) <= 0;
  }
  isLowStock(item: any): boolean {
    const quantity =Number(item?.quantity || 0);
    const minimumStock =Number(item?.minimumStock || 0);
    return (
      quantity > 0 &&
      quantity <=
      minimumStock
    );

  }
  get tableStatus() {
    return (this.dashboard?.tableStatus ||
      {
        total:0,
        available:0,
        occupied:0,
        maintenance:0
      }
    );
  }
  get tableOccupancyRate():number {
    const total =this.tableStatus.total;
    if (total === 0) {
      return 0;
    }
    return Math.round((this.tableStatus.occupied /total) * 100);

  }
  get todayBookings():any[] {
    return (
      this.dashboard?.todayBookings ||[]
    );
  }
  get liveDeliveries():any[] {
    return (
      this.dashboard
        ?.liveDeliveries ||[]
    );
  }
  get paymentOverview() {
    return (
      this.dashboard?.paymentOverview ||
      {
        cash: 0,
        aba: 0,
        card: 0,
        unpaid: 0,
        paid: 0

      }
    );
  }
  get paymentTotal():number {
    return (
      Number(
        this.paymentOverview.cash ||
        0
      ) +

      Number(
        this.paymentOverview.aba ||
        0
      ) +

      Number(
        this.paymentOverview.card ||
        0
      )

    );

  }
  getPaymentPercentage(value: number): number {
    const total =this.paymentTotal;
    if (total === 0) {
      return 0;
    }
    return Math.round(
      (Number(value || 0) /total) * 100
    );

  }
  get recentOrders():any[] {
    return (

      this.dashboard
        ?.recentOrders ||

      []

    );

  }

  getOrderNumber(id: string): string {
    if (!id) {
      return '#--------';
    }
    return ('#' +id.slice(-8).toUpperCase());
  }
  getStatusClass(status: string): string {
    if (!status) {
      return '';
    }
    return status.toLowerCase().replace(/\s+/g,'-');
  }
  getCustomerName(order: any): string {
    return (
      order?.userId?.fullName ||
      order?.fullName ||
      'Guest'
    );

  }
  getCustomerEmail(order: any): string {
    return (
      order?.userId?.email ||
      order?.email ||
      ''
    );

  }
  getOrderTotal(order: any): number {
    return Number(
      order?.totalAmount ||
      0
    );

  }
  getBookingCustomer(booking: any): string {
    return (
      booking?.userId?.fullName ||
      booking?.fullName || 'Guest'
    );

  }


  getBookingTable(booking: any): string {

    return (
      booking?.tableId?.tableNumber ||'N/A'
    );

  }

  getRiderName(delivery: any): string {
    return (
      delivery?.riderId?.fullName ||
      delivery?.rider?.fullName ||
      'Unassigned'
    );

  }
  getDeliveryOrderNumber( delivery: any): string {
    const orderId =typeof delivery?.orderId ==='object'? delivery?.orderId?._id: delivery?.orderId;
    return this.getOrderNumber(
      orderId
    );

  }
  getDeliveryStatusClass( status: string): string {
    return this.getStatusClass(status);
  }

  get todayRevenue():
    number {
    return Number(
      this.dashboard?.statistics?.todayRevenue ||0
    );

  }
  get totalOrders():
    number {
    return Number(
      this.dashboard?.statistics?.totalOrders ||0
    );

  }

  get todayOrders():
    number {
    return Number(
      this.dashboard?.statistics?.todayOrders ||0
    );

  }
  get todayBookingsCount():
    number {
    return Number(
      this.dashboard?.statistics?.todayBookings ||0
    );

  }

  get totalMenu():
    number {
    return Number(
      this.dashboard?.statistics?.totalMenu ||0
    );

  }

  get availableMenu():
    number {
    return Number(
      this.dashboard?.statistics?.availableMenu ||0
    );

  }
  get unavailableMenu():
    number {
    return Number(
      this.dashboard?.statistics?.unavailableMenu ||0
    );

  }
  get lowStock():
    number {
    return Number(
      this.dashboard?.statistics?.lowStock ||0
    );

  }
  get outOfStock():
    number {
    return Number(
      this.dashboard?.statistics?.outOfStock ||0
    );

  }
  get activeDeliveries():
    number {
    return Number(
      this.dashboard?.statistics?.activeDeliveries ||0
    );

  }

  get totalCustomers():
    number {
    return Number(
      this.dashboard?.statistics?.totalCustomers ||0
    );

  }
  get totalStaff():
    number {
    return Number(
      this.dashboard?.statistics?.totalStaff ||0
    );

  }

  get totalRiders():
    number {
    return Number(
      this.dashboard?.statistics?.totalRiders ||0
    );

  }
  get popularMenu():
    number {
    return Number(
      this.dashboard?.statistics?.popularMenu ||0
    );

  }


  get hasDashboardData():
    boolean {
    return (
      this.dashboard !== null &&
      this.dashboard !== undefined
    );

  }
trackById(index: number,item: any): any {
    return (
      item?._id ||
      item?.id ||
      index
    );
  }
  trackByDate(index: number,item: RevenueChart): string {

    return (
      item.date ||
      String(index)
    );

  }
  trackByProduct(index: number,item: PopularProduct): string {
    return (
      item.productId ||
      String(index)
    );

  }

}