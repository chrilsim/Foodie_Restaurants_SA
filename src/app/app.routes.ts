import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { Layout } from './layout/layout/layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { MainDashboard } from './features/dashboard/main-dashboard/main-dashboard';
import { MenuManagement } from './features/dashboard/menu-management/menu-management';
import { Staff } from './features/dashboard/staff/staff';
import { Customer } from './features/dashboard/customer/customer';
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
  
  {path: 'main-dashboard',component: MainDashboard,children:[
      {path: 'menu-management',component: MenuManagement},
      {path: 'dashboard',component: Dashboard},
      {path: 'staff',component: Staff},
      {path: 'customer',component:Customer},
  ]},

  {path:'login',component:Login},
  {path:'register',component:Register},
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
