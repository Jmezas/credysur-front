import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
  },  
  {
    path: 'menus',
    loadChildren: () => import('../../components/menus/menus.module').then(m => m.MenusModule),
    data: {
      breadcrumb: "Menus"
    }
  },
  {
    path: 'users',
    loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule),
    data: {
      breadcrumb: "Usurios"
    }
  },
  {
    path: 'menus',
    loadChildren: () => import('../../components/menus/menus-routing.module').then(m => m.MenusRoutingModule),
    data: {
      breadcrumb: "Menus"
    }
  },
  {
    path: 'reports',
    loadChildren: () => import('../../components/reports/reports.module').then(m => m.ReportsModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('../../components/setting/setting.module').then(m => m.SettingModule),
    data: {
      breadcrumb: "Configuracion"
    }
  },
  {
    path: 'loans',
    loadChildren: () => import('../../components/loan/loan.module').then(m => m.LoanModule),
    data: {
      breadcrumb: "Prestamo"
    }
  },
 
];