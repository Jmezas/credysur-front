import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { LoanRoutingModule } from './loan-routing.module';
import { ListLoanComponent } from './list-loan/list-loan.component';
import { CreateLoanComponent } from './create-loan/create-loan.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";
@NgModule({
    declarations: [ListLoanComponent, CreateLoanComponent],
    imports: [
        CommonModule,
        LoanRoutingModule,
        NgbModule,
        NgxSpinnerModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class LoanModule { }
