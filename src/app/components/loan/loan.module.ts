import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoanRoutingModule} from './loan-routing.module';
import {ListLoanComponent} from './list-loan/list-loan.component';
import {CreateLoanComponent} from './create-loan/create-loan.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {PdfViewerComponent} from '../../shared/components/pdf-viewer/pdf-viewer.component';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {ListPayComponent} from './components/list-pay/list-pay.component';
import {PayComponent} from './components/pay/pay.component';
import {DetailPayComponent} from './components/detail-pay/detail-pay.component';
import {AmortizationPayComponent} from './components/amortization-pay/amortization-pay.component';
import {InputMaskModule} from '@ngneat/input-mask';
import {PayAllComponent} from './components/pay-all/pay-all.component';

@NgModule({
    declarations: [
        ListLoanComponent,
        CreateLoanComponent,
        PdfViewerComponent,
        ListPayComponent,
        PayComponent,
        DetailPayComponent,
        AmortizationPayComponent,
        PayAllComponent
    ],
    imports: [
        CommonModule,
        LoanRoutingModule,
        NgbModule,
        NgxSpinnerModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxExtendedPdfViewerModule,
        InputMaskModule
    ]
})
export class LoanModule {
}
