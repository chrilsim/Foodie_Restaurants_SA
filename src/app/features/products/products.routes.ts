import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { TableBooking } from './components/table-booking/table-booking';
import { OrderOnline } from './components/order-online/order-online';
import { ProductDetail } from './product-detail/product-detail';

export const PRODUCTS_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path:'home',component:Home},
    {path:'table-booking',component:TableBooking},
    {path:'order-online',component:OrderOnline},
    {path:'product-detail',component:ProductDetail},
];