import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { NgChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartistModule } from 'ng-chartist'
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    NgChartsModule,
    Ng2GoogleChartsModule,
    NgxChartsModule,
    ChartistModule,
    ReportsRoutingModule,
    SharedModule,
    NgbModule,
    NgxSpinnerModule,
    NgSelectModule,
    FormsModule
  ]
})
export class ReportsModule { }
