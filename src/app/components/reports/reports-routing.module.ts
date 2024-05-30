import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import {AuthGuard} from '../auth/auth.guard';
import {RoleGuard} from '../auth/role.guard';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: {
      title: "Reporte diario",
      breadcrumb: "Reporte"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
