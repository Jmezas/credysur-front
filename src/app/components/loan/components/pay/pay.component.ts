import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDateAdapter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ListDetailResponse} from '../../../../shared/models/listDetailResponse';
import {LoansReponse} from '../../../../shared/models/loanResponse';
import {GeneralService} from '../../../../shared/service/General/general.service';
import {Result} from '../../../../shared/models/result.interface';
import {BankService} from '../../../../shared/service/bank/bank.service';
import {ToastrService} from 'ngx-toastr';
import {LoanService} from '../../../../shared/service/loans/loan.service';
import Swal from 'sweetalert2';
import {Droplist} from '../../../../shared/models/droplist';
import {PdfViewerPayComponent} from '../../../../shared/components/pdf-viewer-pay/pdf-viewer-pay.component';
import {DismissReason} from '../../../../shared/common/dismissReason';
@Component({
    selector: 'app-pay',
    templateUrl: './pay.component.html',
    styleUrl: './pay.component.scss'
})
export class PayComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    @Input() detailPay: ListDetailResponse;
    @Input() loan: LoansReponse;
    payMount: number = 0;
    remainingPaymentPorcentje: number = 0;
    moraPorcentaje: number = 0;
    isVisibledMora: boolean = false;
    datePay = this.today;
    isVisibledBank: boolean = false;
    listTypePay: Droplist[] = [];
    listBank: any[] = [];
    typePay;
    typeBank;
    payMountRest: number = 0;
    discount : number  =0;
    closeResult: string = '';
    constructor(private dateAdapter: NgbDateAdapter<string>,
                private ngbCalendar: NgbCalendar,
                private apiGeneral: GeneralService,
                private apiBank: BankService,
                private toastr: ToastrService,
                private apiLoan: LoanService,
                private modalService: NgbModal,
                ) {
    }

    ngOnInit(): void {
        this.getListTypePay();
        this.getListBank();
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

    getListBank() {
        this.apiBank.getAll().subscribe((res: Result) => {
            this.listBank = res.payload.data;
        });
    }

    onCalculateInterPay() {
        this.remainingPaymentPorcentje = this.payMount * (this.moraPorcentaje / 100);
    }

    /**
     * aplicar mora
     * @param event checkbox
     */
    onChangeMora(event) {
        const value = event.target.value;
        if (value === 'true') {
            this.isVisibledMora = true;
        } else {
            this.isVisibledMora = false;
            this.remainingPaymentPorcentje = 0;
            this.moraPorcentaje = 0;
        }
    }

    /**
     * calcular monto
     */
    onChangeMonto() {
        const value = parseFloat(this.payMount.toString());
        const payCuota = this.detailPay.totales - this.detailPay.pago;
        if (value > (payCuota)) {
            this.payMount = payCuota;
            this.payMountRest = value - payCuota;
            this.toastr.info('El monto es mayor a la cuota | el monto restante es ' + this.payMountRest.toFixed(2), '¡Error!');
            return;
        }
        if (value < 0) {
            this.payMount = 0;
            this.toastr.info('El monto no puede ser negativo', '¡Error!');
            this.moraPorcentaje = 0;
            this.remainingPaymentPorcentje = this.payMount * (this.moraPorcentaje / 100);
            return;
        }
        if (value === payCuota) {
            this.moraPorcentaje = 0;
            this.payMountRest = 0;
            this.remainingPaymentPorcentje = this.payMount * (this.moraPorcentaje / 100);
            return;
        }
        this.payMount = value;

    }
    onSavePay() {
        if (!this.typePay) {
            this.toastr.warning('Seleccionar el tipo de pago', '¡Advertencia!');
            return;
        }

        if (this.typePay === 2 && !this.typeBank) {
            this.toastr.warning('Seleccionar el tipo de banco', '¡Advertencia!');
            return;
        }

        if (this.payMount ===0) {
            this.toastr.warning('Agregar el monto de pago', '¡Advertencia!');
            return;
        }

        const data = {
            idLoan: this.loan.iIdPrestamo,
            number: this.detailPay.numero,
            type: 1,
            pay: this.payMount,
            mora: this.isVisibledMora ? 'Si' : 'No',
            moraPor: this.moraPorcentaje,
            typePay: this.typePay,
            typeBank: this.typeBank = this.typeBank || 0,
            payDate: `${this.datePay['year']}-${this.datePay['month']}-${this.datePay['day']}`,
            accumulatedAmount: this.payMountRest,
            accumulatedAmountPorcentaje: this.remainingPaymentPorcentje,
            discount: this.discount === null ? 0 : this.discount
        };
        console.log(data);
        this.apiLoan.payment(data).subscribe((res: Result) => {
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
                    this.activeModal.close();
                    this.openModalPayPDF(additionalData);
                }
            });
        });
    }
    openModalPayPDF(payId:number) {
        const modalPdf = this.modalService.open(PdfViewerPayComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true});
        modalPdf.componentInstance.loanId = this.loan.iIdPrestamo;
        modalPdf.componentInstance.numberId = this.detailPay.numero;
        modalPdf.componentInstance.payId = payId;
        modalPdf.componentInstance.title = 'TICKET DE PAGO';
        modalPdf.result.then ((result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
    }
}
