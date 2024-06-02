import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDateAdapter, NgbModal,} from '@ng-bootstrap/ng-bootstrap';
import {GeneralService} from '../../../../shared/service/General/general.service';
import {BankService} from '../../../../shared/service/bank/bank.service';
import {ToastrService} from 'ngx-toastr';
import {LoanService} from '../../../../shared/service/loans/loan.service';
import {Droplist} from '../../../../shared/models/droplist';
import {LoansReponse} from '../../../../shared/models/loan.interface';
import {Result} from '../../../../shared/models/result.interface';
import Swal from 'sweetalert2';
import {ListDetailPayResponse} from '../../../../shared/models/listDetailPayResponse';
import {Constants} from '../../../../shared/common/constants';
import {PdfViewerPayComponent} from '../../../../shared/components/pdf-viewer-pay/pdf-viewer-pay.component';
import {DismissReason} from '../../../../shared/common/dismissReason';

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
    payMount: number = 0;
    payMountRest: number = 0;
    active = 1;
    listDetailPay: ListDetailPayResponse[] = [];
    constants = new Constants();
    closeResult: string = '';
    constructor(private dateAdapter: NgbDateAdapter<string>,
                private ngbCalendar: NgbCalendar,
                private apiGeneral: GeneralService,
                private apiBank: BankService,
                private toastr: ToastrService,
                private apiLoan: LoanService,
                private modalService: NgbModal,) {
    }

    ngOnInit() {
        this.getListTypePay();
        this.getListBank();
    }

    onActive() {
        if (this.active == 2) {
            this.getDetailPayGeneral(this.loan.iIdPrestamo);
        }
    }

    getDetailPayGeneral(id: number) {
        this.apiLoan.getListDetailPayGeneral(id).subscribe({
            next: (res: Result) => {
                console.log('lista', res.payload.data);
                this.listDetailPay = res.payload.data;
            },
            error: (err) => {
                console.log(err);
            },
        });
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
            this.typeBank = null;
        }
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
            this.typePay = 1;
        });
    }

    /**
     * calcular monto
     */
    onChangeMonto() {
        const value = parseFloat(this.payMount.toString());
        const payCuota = this.loan.nTotal;
        if (value > payCuota) {
            this.payMount = payCuota;
            this.payMountRest = value - payCuota;
            this.toastr.info('El monto es mayor a la cuota | el monto restante es ' + this.payMountRest.toFixed(2), '¡Error!');
            return;
        }
        if (value < 0) {
            this.payMount = 0;
            this.toastr.info('El monto no puede ser negativo', '¡Error!');
            return;
        }
        if (value === payCuota) {
            this.payMountRest = 0;
            return;
        }
        if (value > 0) {
            this.payMountRest = 0;
            return;
        }
        this.payMount = value == 0 ? 0 : this.payMount;

    }

    openModalPayPDF(payId:number, send:boolean) {
        const modalPdf = this.modalService.open(PdfViewerPayComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true});
        modalPdf.componentInstance.loanId = this.loan.iIdPrestamo;
        modalPdf.componentInstance.numberId = 0;
        modalPdf.componentInstance.payId = payId;
        modalPdf.componentInstance.title = 'TICKET DE PAGO';
        modalPdf.componentInstance.send = send;
        modalPdf.result.then ((result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
    }

    onDeletePay(id: number) {
        Swal.fire({
            title: '¿Estas seguro?',
            text: 'No podras revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, ¡borrarlo!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                let DeleteData = {
                    idPago: 0,
                    idPrestamo: this.loan.iIdPrestamo,
                    numberPay: id,
                };
                this.apiLoan.deleteDetailPayGeneral(DeleteData).subscribe({
                    next: (res) => {
                        console.log('resultao del elimano', res);
                        this.activeModal.close();
                        this.toastr.success(this.constants.MESSAGE_SUCCESS_DELETE, this.constants.TITLE_SUCCESS);
                    },
                    error: err => {
                        console.log(err);
                        const messageError = err || 'Ocurrió un error al elminar el pago';
                        this.toastr.error(messageError, this.constants.TITLE_ERROR);
                    }
                });
            }
        });
    }

    onSavePay() {
        if (this.payMount ===0 || this.payMount.toString() === '') {
            this.toastr.warning('Es necesario el monto de pago', '¡Advertencia!');
            return;
        }
        if (this.typePay === 0) {
            this.toastr.warning('Es necesario el tipo de pago', '¡Advertencia!');
            return;
        }
        const data = {
            idLoan: this.loan.iIdPrestamo,
            pay: this.payMount,
            mora: 'No',// activo temporal
            moraPor: 0, // activo temporal
            typePay: this.typePay,
            typeBank: this.typeBank = this.typeBank || 0,
            payDate: `${this.datePay['year']}-${this.datePay['month']}-${this.datePay['day']}`,
            accumulatedAmount: this.payMountRest,
            accumulatedAmountPorcentaje: 0, // activo temporal
            discount: this.discount === null ? 0 : this.discount
        };
        this.apiLoan.paymentGeneral(data).subscribe({
                next: (res: Result) => {
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
                            this.openModalPayPDF(additionalData,true);
                        }
                    });
                }, error(error: any) {
                    const messageError = error || 'Ocurrió un error en el pago';
                    this.toastr.error(messageError, this.constants.TITLE_ERROR);
                }
            }
        );
    }
}
