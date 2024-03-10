import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AgGridModule } from '@ag-grid-community/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardModule } from './components/dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module'; 
import { MenusModule } from './components/menus/menus.module'; 
import { UsersModule } from './components/users/users.module'; 
import { SettingModule } from './components/setting/setting.module';;
import { ReportsModule } from './components/reports/reports.module';
import { AuthModule } from './components/auth/auth.module'; 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './shared/service/auth-interceptor';
import { ToastrModule } from "ngx-toastr";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';  
import { LoanModule } from './components/loan/loan.module';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    DashboardModule, 
    SettingModule,
    ReportsModule,
    AuthModule,
    SharedModule,   
    MenusModule,
    UsersModule,
    LoanModule,
    AgGridModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' } ,  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
