import {Component, OnInit, inject} from '@angular/core';
import {Result} from 'src/app/shared/models/result.interface';
import {GeneralService} from 'src/app/shared/service/General/general.service';
import {LoanService} from 'src/app/shared/service/loans/loan.service';
import {NgbCalendar, NgbDateParserFormatter, NgbDate, NgbDateAdapter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerService} from 'src/app/shared/service/customers/customer.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {createMask} from '@ngneat/input-mask';
import {Calculate, LoanRequest} from '../../../shared/service/loans/models/loan';
import Swal from 'sweetalert2';
import {LoansReponse} from '../../../shared/models/loanResponse';
import {ListPayComponent} from '../components/list-pay/list-pay.component';
import {DismissReason} from '../../../shared/common/dismissReason';
import {AllPdfLoanComponent} from '../components/all-pdf-loan/all-pdf-loan.component';

@Component({
    selector: 'app-create-loan',
    templateUrl: './create-loan.component.html',
    styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {
    amountLoan: number = 0;
    calendar = inject(NgbCalendar);
    formatter = inject(NgbDateParserFormatter);
    closeResult: string;
    fromDateAmortizar: NgbDate = this.calendar.getToday();
    currencyList = [];

    interesCuota: number = 0;
    // Variables para el tipo de documento
    typeDocumentList = [];
    typeDocument: number = null;

    // Variables para el tipo de pago
    formeList = [];
    formePay: number = null;

    // Variables para el buscador de clientes
    customerList = [];
    customerName: string = '';
    address: string = '';
    state = '';
    amountTotalLoanText: number = 0;
    amountTotalLoan: number = 0;

    quotaTotal: number = 0;
    calculateLoan: any[] = [];
    totalCapital = 0;
    optionFrequency: number = 0;
    startDate = '';
    isVisibleFormPay: boolean = false;
    formLoan: FormGroup;

    constructor(
        private apiLoan: LoanService,
        private apiGeneral: GeneralService,
        private apiCustomer: CustomerService,
        private toastr: ToastrService,
        private dateAdapter: NgbDateAdapter<string>,
        private ngbCalendar: NgbCalendar,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit() {
        this.createForm();
        this.getSerie();
        this.getCurrency();
        this.getTypedocument();
        this.getTypePay();
        this.startDate = this.today;
        this.formLoan.get('dateIssue').patchValue(this.today);

    }

    createForm() {
        this.formLoan = this.formBuilder.group({
            dateIssue: ['', Validators.required],
            customerId: [null, Validators.required],
            serie: ['', Validators.required],
            numero: ['', Validators.required],
            currency: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(1)]],
            interest: ['', [Validators.required, Validators.maxLength(2)]],
            quota: ['', [Validators.required, Validators.maxLength(2)]],
            fromPay: [null, Validators.required],
            quotaValue: [''],
            interestGained: [''],
            total: [''],
            observation: [''],
        });
        this.formLoan.get('amount').valueChanges.subscribe(value => {
            const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));

            //this.formLoan.get('amount').patchValue(numericValue);
            this.amountLoan = numericValue;
        });

    }

    getSerie() {
        this.apiLoan.getserie().subscribe((data: Result) => {
            this.formLoan.get('serie').patchValue(data.payload.data.serie);
            this.formLoan.get('numero').patchValue(data.payload.data.codigo);
        });
    }

    get today() {
        return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
    }

    getCurrency() {
        this.apiGeneral.dropdownList(2).subscribe((res: any) => {
            this.currencyList = res;
            this.formLoan.get('currency').patchValue(this.currencyList[0].code);
        });
    }

    getTypedocument() {
        this.apiGeneral.dropdownList(1).subscribe((res: any) => {
            this.typeDocumentList = res;
            this.typeDocument = this.typeDocumentList[0].code;
        });
    }

    getTypePay() {
        this.apiGeneral.dropdownList(3).subscribe((res: any) => {
            this.formeList = res;
        });
    }

    //formate input
    currencyInputMask = createMask({
        alias: 'numeric',
        groupSeparator: ',',
        digits: 2,
        digitsOptional: false,
        prefix: 'S/ ',
        placeholder: '0.00',
    });


    numberInputMask = createMask({
        alias: 'numeric',
        groupSeparator: '',
        digits: 0,
        digitsOptional: true,
        prefix: '',
        placeholder: '0',
    });


    onCalculate() {
        if (this.formLoan.invalid) {
            this.toastr.warning('Falta agregar campos', 'ADVERTENCIA!');
            this.formLoan.markAllAsTouched();
            return;
        }

        if (this.amountLoan > this.amountTotalLoan) {
            this.toastr.warning('El monto de requerido supera al monto de prestamo', 'ADVERTENCIA!');
            return;
        }
        const requestData: Calculate = {
            amount: this.amountLoan,
            rateInterestAnnual: this.formLoan.value.interest,
            quotaNumber: this.formLoan.value.quota,
            formePay: this.formLoan.value.fromPay,
            optionFrequency: this.optionFrequency = 0 ? this.optionFrequency : 1,
            startDate: `${this.startDate['year']}-${this.startDate['month']}-${this.startDate['day']}`,
        };
        console.log(requestData);
        this.apiLoan.calculcateLoanPay(requestData).subscribe((res: Result) => {
            this.calculateLoan = res.payload.data;

            this.interesCuota = this.calculateLoan.reduce((total, response) => total + response.interesPagado, 0);
            this.totalCapital = this.calculateLoan.reduce((total, response) => total + response.cuota, 0);
            this.quotaTotal = this.calculateLoan[0].cuota;

            this.formLoan.get('interestGained').patchValue(this.interesCuota);
            this.formLoan.get('total').patchValue(this.totalCapital);
            this.formLoan.get('quotaValue').patchValue(this.quotaTotal);
        });
    }

    searchCustomer(event) {
        this.customerList = [];
        if (event.term.length === 0) {
            return;
        }
        this.apiCustomer.searchCustomer(event.term, 1).subscribe((res: any) => {
            this.customerList = res.payload.data;
        });
    }

    onCustomerChange(event) {
        console.log(event);
        const selectedCustomer = this.customerList.find(element => element.id === event);

        if (selectedCustomer) {
            this.customerName = selectedCustomer.name;
            this.address = selectedCustomer.address;
            this.state = selectedCustomer.typeState;
            this.amountTotalLoan = parseFloat(selectedCustomer.total);
            this.amountTotalLoanText = selectedCustomer.total;
        }
        this.formLoan.get('customerId').patchValue(event);
    }

    onItemChange(event) {
        console.log(event);
        this.optionFrequency = parseInt(event);
    }

    onFormeChange() {
        console.log('entro!!');
        if (this.formLoan.value.fromPay === 1) {
            this.isVisibleFormPay = true;
            return;
        }
        this.isVisibleFormPay = false;
    }

    /**
     * modal
     */
    openModal(loanId: number) {
        const modalPDF = this.modalService.open(AllPdfLoanComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                centered: true,
                backdrop: 'static',
                animation: true,
                backdropClass: 'modal-backdrop',
            });

        modalPDF.componentInstance.loanId = loanId;

        modalPDF.result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
    }

    onSaveLoan() {
        if (this.formLoan.invalid) {
            this.toastr.warning('Falta agregar campos', 'ADVERTENCIA!');
            this.formLoan.markAllAsTouched();
            return;
        }
        if (this.amountLoan > this.amountTotalLoan) {
            this.toastr.warning('El monto de requerido supera al monto de préstamo', 'ADVERTENCIA!');
            return;
        }
        if (this.calculateLoan.length === 0) {
            this.toastr.warning('Falta realizar el cálculo', 'ADVERTENCIA!');
            return;
        }
        let data: LoanRequest = {
            customerID: this.formLoan.value.customerId,
            serie: this.formLoan.value.serie,
            numero: this.formLoan.value.numero,
            dateIssue: `${this.formLoan.value.dateIssue['year']}-${this.formLoan.value.dateIssue['month']}-${this.formLoan.value.dateIssue['day']}`,
            currency: this.formLoan.value.currency,
            amount: this.amountLoan,
            interest: this.formLoan.value.interest,
            quota: this.formLoan.value.quota,
            fromPay: this.formLoan.value.fromPay,
            quotaValue: this.formLoan.value.quotaValue,
            interestGained: this.formLoan.value.interestGained,
            total: this.formLoan.value.total,
            observation: this.formLoan.value.observation,
        };
        console.log('data====>', data);
        this.apiLoan.insertLoan(data).subscribe((res: Result) => {
            const [status, message, additionalData] = res.payload.data.split('|');
            const swalOptions = {
                title: status === 'success' ? 'Exito!' : 'Error!',
                text: message,
                icon: status,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6'
            };

            Swal.fire(swalOptions).then((result) => {
                if (result.isConfirmed && status === 'success') {
                    this.onCleanForm();
                    this.openModal(additionalData);
                }
            });

        });
    }

    onCleanForm() {
        this.formLoan.reset();
        this.calculateLoan = [];
        this.getSerie();
        this.getCurrency();
        this.state = '';
        this.amountTotalLoanText = 0;
        this.startDate = this.today;
        this.formLoan.get('dateIssue').patchValue(this.today);
        this.customerName = '';
        this.address = '';
    }
}
