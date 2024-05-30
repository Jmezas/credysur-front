import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ZoneComponent } from './zone/zone.component';
import { CategoryComponent } from './category/category.component';
import { CustomerComponent } from './customer/customer.component';
import {CreateProfileComponent} from './profile/create-profile/create-profile.component';
import {AuthGuard} from '../auth/auth.guard';
import {RoleGuard} from '../auth/role.guard';
import {AccessDeniedComponent} from '../../shared/components/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: {
      title: "Cliente",
      breadcrumb: "Panel"
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard,RoleGuard],
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
    canActivate: [AuthGuard,RoleGuard],
    data: {
      title: "Zona",
      breadcrumb: "Zona"
    }
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: {
      title: "Rubro de negocio",
      breadcrumb: "Rubro"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
