import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AuthGuard } from '../auth/auth.guard';
import {RoleGuard} from '../auth/role.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-user',
        component: ListUserComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: "Lista de usuario",
          breadcrumb: "Lista de usuario",
        }
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Crar Usuario",
          breadcrumb: "Crar Usuario"
        }
      },
      {
        path: ":id/edit-user",
        component: CreateUserComponent,
        canActivate: [AuthGuard],
        data: {
          title: "Editar usuario",
          breadcrumb: "Editar usuario",
        },
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
