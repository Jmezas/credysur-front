import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {BankService} from '../../../../shared/service/bank/bank.service';
import {Result} from '../../../../shared/models/result.interface';
import {ListDetailResponse} from '../../../../shared/models/listDetailResponse';
import Swal from 'sweetalert2';
import {LoanService} from '../../../../shared/service/loans/loan.service';
import {GeneralService} from '../../../../shared/service/General/general.service';
import {ToastrService} from 'ngx-toastr';
import {Droplist} from '../../../../shared/models/droplist';
import {LoansReponse} from '../../../../shared/models/loan.interface';

@Component({
    selector: 'app-amortization-pay',
    templateUrl: './amortization-pay.component.html',
    styleUrl: './amortization-pay.component.scss'
})
export class AmortizationPayComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    @Input() detailPay: ListDetailResponse[];
    @Input() loan: LoansReponse;
    @Input() selectIdPay: { [key: number]: boolean };
    listTypePay: Droplist[] = [];
    listBank: any[] = [];
    isVisibledBank: boolean = false;
    typePay: any;
    typeBank: any;
    isVisibledMora: boolean;
    remainingPaymentPorcentje: number;
    moraPorcentaje: number;
    totalPay: number = 0;
    datePayAmortizar: string = '';
    dataAmortizar: any[];
    remainingPayment: number = 0;
    discountAmortizacion: any;

    constructor(
        private apiBank: BankService,
        private dateAdapter: NgbDateAdapter<string>,
        private ngbCalendar: NgbCalendar,
        private apiLoan: LoanService,
        private apiGeneral: GeneralService,
        private toastr: ToastrService,
    ) {

    }

    ngOnInit(): void {
        this.getListBank();
        this.onAmortizar();
        this.getListTypePay();
    }

    getListBank() {
        this.apiBank.getAll().subscribe((res: Result) => {
            this.listBank = res.payload.data;
        });
    }

    /**
     * lista de tipo de pago
     */
    getListTypePay() {
        this.apiGeneral.dropdownList(6).subscribe((res: any) => {
            this.listTypePay = res;
        });
    }

    get today() {
        return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
    }

    /**
     * Listar cuota para amortizar pagos
     */
    onAmortizar() {
        this.dataAmortizar = [];
        this.datePayAmortizar = this.today;
        this.detailPay.filter((item) => this.selectIdPay[item.numero])
            .forEach((item) => {
                this.dataAmortizar.push({
                    number: item.numero,
                    pay: item.totales - item.pago,
                    cuota: item.totales,
                    monto: item.pago,
                    payDate: item.fecha,
                    discount: 0,
                    accumulatedAmount: 0,
                    accumulatedAmountPorcentaje: 0,
                });
                this.totalPay += item.totales - item.pago;
                this.remainingPayment += 0;
            });
    }
    /**
     * Calcular interes
     */
    onCalculateInteres() {
        this.remainingPaymentPorcentje = this.totalPay * (this.moraPorcentaje / 100);
        const calculatemoraNumber = this.remainingPaymentPorcentje / this.dataAmortizar.length;
        const calculateMora = this.moraPorcentaje / this.dataAmortizar.length;
        this.dataAmortizar.map((item) => {
            item.accumulatedAmountPorcentaje = calculatemoraNumber;
            item.moraPor = calculateMora;
        });
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
        }
    }

    /**
     * aplicar mora
     * @param event checkbox
     */
    onChangeMora(event: any) {
        const value = event.target.value;
        if (value === 'true') {
            this.isVisibledMora = true;
        } else {
            this.isVisibledMora = false;
            this.remainingPaymentPorcentje = 0;
            this.moraPorcentaje = 0;
            this.dataAmortizar.map((item) => {
                item.accumulatedAmountPorcentaje = 0;
                item.moraPor = 0;
            });
        }
    }

    /**
     * Calcular el descuento
     */
    onCalculateDiscount() {
        // Convertir directamente a número y tratar valores falsy como 0
        this.discountAmortizacion = Number(this.discountAmortizacion) || 0;

        if (this.discountAmortizacion === 0) {
            this.dataAmortizar.forEach((item) => {
                item.discount = 0;
            });
            return;
        }

        if (this.totalPay < this.discountAmortizacion) {
            Swal.fire({
                title: '¡Error!',
                text: 'El monto de descuento es mayor al monto total a pagar',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            this.discountAmortizacion = 0;
            return;
        }

        const allPayDetail = this.dataAmortizar.length; // Cantidad de detalles de pago seleccionados
        const discountValue = this.discountAmortizacion / allPayDetail;

        this.dataAmortizar.forEach((item) => {
            item.discount = discountValue;
        });
    }

    onSaveAmortizar() {
        if (!this.typePay) {
            this.toastr.warning('Seleccionar el tipo de pago', '¡Advertencia!');
            return;
        }

        if (this.typePay === 2 && !this.typeBank) {
            this.toastr.warning('Seleccionar el tipo de banco', '¡Advertencia!');
            return;
        }

        this.dataAmortizar.map((item) => {
            item.idLoan = this.loan.iIdPrestamo;
            item.typeBank = this.typeBank === null ? 0 : this.typeBank;
            item.mora = this.isVisibledMora ? 'Si' : 'No';
            item.typePay = this.typePay;
            item.type = 2;
            item.payDate = `${this.datePayAmortizar['year']}-${this.datePayAmortizar['month']}-${this.datePayAmortizar['day']}`;
            item.accumulatedAmount = this.remainingPayment;
            item.accumulatedAmountPorcentaje = this.remainingPaymentPorcentje;
        });
        console.log(this.dataAmortizar);
        this.apiLoan.paymentAmortization(this.dataAmortizar).subscribe({
            next: (res: Result) => {
                console.log(res);
                Swal.fire({
                    title: '¡Exito!',
                    text: res.payload.data,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });
                this.activeModal.close();
            }, error(error: any) {
                const messageError = error || 'Ocurrió un error en el pago';
                this.toastr.error(messageError, this.constants.TITLE_ERROR);
            }
        });

    }
}
