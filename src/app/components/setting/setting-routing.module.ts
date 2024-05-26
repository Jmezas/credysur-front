import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ZoneComponent } from './zone/zone.component';
import { CategoryComponent } from './category/category.component';
import { CustomerComponent } from './customer/customer.component';
import {CreateProfileComponent} from './profile/create-profile/create-profile.component';
import {AuthGuard} from '../auth/auth.guard';


const routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Cliente",
      breadcrumb: "Panel"
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Pefil de usuario",
      breadcrumb: "Pefil"
    }
  },
  {
    path: 'create-profile',
    component: CreateProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Crear Perfil y permisos",
      breadcrumb: "Pefil"
    }
  },
  {
    path: ':id/edit-profile',
    component: CreateProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Editar Perfil y Permisos",
      breadcrumb: "Pefil"
    }
  },
  {
    path: 'zone',
    component: ZoneComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Zona",
      breadcrumb: "Zona"
    }
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Rubro de negocio",
      breadcrumb: "Rubro"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
