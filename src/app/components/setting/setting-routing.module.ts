import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ZoneComponent } from './zone/zone.component';
import { CategoryComponent } from './category/category.component';
import { CustomerComponent } from './customer/customer.component';


const routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    data: {
      title: "Cliente",
      breadcrumb: "Panel"
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: "Pefil de usuario",
      breadcrumb: "Pefil"
    }
  },
  {
    path: 'zone',
    component: ZoneComponent,
    data: {
      title: "Zona",
      breadcrumb: "Zona"
    }
  },
  {
    path: 'category',
    component: CategoryComponent,
    data: {
      title: "Categoria",
      breadcrumb: "Categoria"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
