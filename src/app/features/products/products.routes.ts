import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { TableBooking } from './components/table-booking/table-booking';
import { OrderOnline } from './components/order-online/order-online';
import { ProductDetail } from './product-detail/product-detail';
import { Checkout } from './checkout/checkout';
import { Search } from './components/search/search';
import { MyReservations } from '../../shared/components/my-reservations/my-reservations/my-reservations';
import { MyOrder } from '../location/my-order/my-order';
import { RiderDashboard } from './components/rider-dashboard/rider-dashboard';
import { KitchenDashboard } from './components/kitchen-dashboard/kitchen-dashboard';
import { UserInformationComponent } from '../user-information/user-information';
export const PRODUCTS_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path:'home',component:Home},
    {path:'table-booking',component:TableBooking},
    {path:'order-online',component:OrderOnline},
    {path:'product-detail/:id',component:ProductDetail},
    {path:'checkout',component:Checkout},
    {path:'search',component:Search},
    { path: 'my-reservations',component:MyReservations},
    { path: 'myorder',component:MyOrder},
    { path: 'myoriderrder',component:RiderDashboard},
    { path: 'kitchen-dashboard',component:KitchenDashboard},
      { path: 'user-info', component: UserInformationComponent },
];