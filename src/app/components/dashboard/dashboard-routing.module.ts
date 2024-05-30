import {inject, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../auth/auth.guard';
import {RoleGuard} from '../auth/role.guard';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'default',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Panel principal",
          breadcrumb: "Panel",
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
