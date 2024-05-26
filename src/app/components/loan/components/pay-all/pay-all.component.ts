import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDateAdapter,  } from '@ng-bootstrap/ng-bootstrap';
import {GeneralService} from '../../../../shared/service/General/general.service';
import {BankService} from '../../../../shared/service/bank/bank.service';
import {ToastrService} from 'ngx-toastr';
import {LoanService} from '../../../../shared/service/loans/loan.service';
import {Droplist} from '../../../../shared/models/droplist';
import {LoansReponse} from '../../../../shared/models/loan.interface';

@Component({
    selector: 'app-pay-all',
    templateUrl: './pay-all.component.html',
    styleUrl: './pay-all.component.scss'
})
export class PayAllComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    @Input() loan: LoansReponse;
    datePay = this.today;
    isVisibledBank: boolean = false;
    typePay;
    typeBank;
    listBank: any[] = [];
    listTypePay: Droplist[] = [];
    discount: number = 0;
    pay: number = 0;
    constructor(private dateAdapter: NgbDateAdapter<string>,
                private ngbCalendar: NgbCalendar,
                private apiGeneral: GeneralService,
                private apiBank: BankService,
                private toastr: ToastrService,
                private apiLoan: LoanService,) {
    }

    ngOnInit() {
        this.getListTypePay();
    }

    get today() {
        return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
    }
    /**
     * seleccionar tipo de banco
     * @param event checkbox
     */
    onTypePayChange(event) {
        if (event === 2) {
            this.isVisibledBank = true;
        } else {
            this.isVisibledBank = false;
            this.typeBank = null
        }
    }


    /**
     * lista de tipo de pago
     */
    getListTypePay() {
        this.apiGeneral.dropdownList(6).subscribe((res: any) => {
            this.listTypePay = res;
        });
    }

    onSavePay(){

    }
}
