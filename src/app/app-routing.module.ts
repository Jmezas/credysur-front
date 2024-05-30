import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import {AccessDeniedComponent} from './shared/components/access-denied/access-denied.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/default',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: content
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: "auth/forget-password",
    component: ForgetPasswordComponent,
  },
  {
    path: "access-denied",
    component: AccessDeniedComponent,
  },
  { path: 'not-found', component: NotFoundComponent  },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
