import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMenuComponent } from './list-menu/list-menu.component';
import { CreateMenuComponent } from './create-menu/create-menu.component';
import {AuthGuard} from '../auth/auth.guard';
import {RoleGuard} from '../auth/role.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-menu',
        component: ListMenuComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: "Lista Menu",
          breadcrumb: "Lista Menu"
        }
      },
      {
        path: 'create-menu',
        component: CreateMenuComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: "Create Menu",
          breadcrumb: "Create Menu"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }
