import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { Layout } from './layout/layout/layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { MainDashboard } from './features/dashboard/main-dashboard/main-dashboard';
import { MenuManagement } from './features/dashboard/menu-management/menu-management';
import { Customer } from './features/dashboard/customer/customer';
import { Kitchen } from './features/dashboard/kitchen/kitchen';
import { Order } from './features/dashboard/order/order';
import { StaffManagementComponent } from './features/dashboard/staff-management/staff-management';
import { UserManagement } from './features/dashboard/user-management/user-management';
import { TableManagement } from './features/dashboard/table-managerment/table-managerment';
import { BookinManagerment } from './features/dashboard/bookin-managerment/bookin-managerment';
import { Inventory } from './features/dashboard/inventory-managerment/inventory-managerment';
import { Notification } from './features/dashboard/notification/notification';
import { Settings } from './features/dashboard/settings/settings';
import { UserInformationComponent } from './features/user-information/user-information';
import { Category } from './features/dashboard/category/category';
export const routes: Routes = [

  //   { path: '', redirectTo: 'products', pathMatch: 'full' },
  // {
  //   path: 'products',
  //   loadChildren: () =>
  //     import('./features/products/products.routes')
  //       .then(m => m.PRODUCTS_ROUTES)
  // },
  // { path: '**', redirectTo: 'products' },
  // { path: 'dashboard', component: Dashboard }



  { path: '', redirectTo: 'products', pathMatch: 'full' },

  {
    path: 'main-dashboard', component: MainDashboard, children: [
      { path: 'menu-management', component: MenuManagement },
      { path: 'dashboard', component: Dashboard },
      { path: 'customer', component: Customer },
      { path: 'kitchen', component: Kitchen },
      { path: 'staff', component: StaffManagementComponent },
      { path: 'user', component: UserManagement },
      { path: 'order', component: Order },
      { path: 'table-managerment', component: TableManagement },
      { path: 'bookig-managerment', component: BookinManagerment },
      { path: 'inventory-managerment', component: Inventory },
      { path: 'notification', component: Notification },
      { path: 'category', component: Category },
    
    ]
  },
  { path: 'setting', component: Settings },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    component: Layout,
    children: [

      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },

      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes')
            .then(m => m.PRODUCTS_ROUTES)
      }

    ]
  },
  

  {
    path: '**',
    redirectTo: 'products'
  }

];
