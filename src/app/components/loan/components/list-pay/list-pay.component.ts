import {Component, Input, OnInit, inject} from '@angular/core';
import {ListDetailResponse} from '../../../../shared/models/listDetailResponse';
import {DismissReason} from '../../../../shared/common/dismissReason';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Result} from '../../../../shared/models/result.interface';
import {LoansReponse} from '../../../../shared/models/loanResponse';
import {LoanService} from '../../../../shared/service/loans/loan.service';
import {PayComponent} from '../pay/pay.component';
import {DetailPayComponent} from '../detail-pay/detail-pay.component';
import {AmortizationPayComponent} from '../amortization-pay/amortization-pay.component';
import {PdfViewerComponent} from '../../../../shared/components/pdf-viewer/pdf-viewer.component';
import {PdfViewerPayComponent} from '../../../../shared/components/pdf-viewer-pay/pdf-viewer-pay.component';
import {ConstantPDF} from '../../../../shared/models/Constants';
import {PayAllComponent} from '../pay-all/pay-all.component';

@Component({
    selector: 'app-list-pay',
    templateUrl: './list-pay.component.html',
    styleUrl: './list-pay.component.scss'
})
export class ListPayComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    listDetail: ListDetailResponse[] = [];
    selectAlls: { [key: number]: boolean } = {};
    @Input() public loan: LoansReponse;
    closeResult: string = '';
    constantPDF = ConstantPDF;
    constructor(
        private modalService: NgbModal,
        private apiLoan: LoanService,
    ) {
    }

    ngOnInit() {
        console.log('ID recibido en ListPayComponent 2:', this.loan);
        this.getListDetail(this.loan.iIdPrestamo);
    }

    getListDetail(id: number) {
        this.apiLoan.getListDetail(id).subscribe({
            next: (res: Result) => {
                this.listDetail = res.payload.data;
            },
            error: (err) => {
                console.log(err);
            },
            complete: () => {
                console.log('complete');
            },
        });
    }

    openModalPago(item: ListDetailResponse) {
        console.log(item);
        const modalPay = this.modalService.open(PayComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true});
        modalPay.componentInstance.detailPay = item;
        modalPay.componentInstance.loan = this.loan;
        modalPay.result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
                console.log('modal cerrado', this.closeResult);
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
        //cerrar modal
        modalPay.hidden.subscribe(() => {
            this.getListDetail(this.loan.iIdPrestamo);
        });
    }

    /**
     * amortizar pago
     */
    openModalAmortizar() {
        if (Object.keys(this.selectAlls).length === 0) {
            Swal.fire({
                title: '¡Error!',
                text: 'Seleccione al menos un detalle de pago',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        const modalAmortizaton = this.modalService.open(AmortizationPayComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
            centered: true
        });
        modalAmortizaton.componentInstance.detailPay = this.listDetail;
        modalAmortizaton.componentInstance.loan = this.loan;
        modalAmortizaton.componentInstance.selectIdPay = this.selectAlls;
        modalAmortizaton.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
        modalAmortizaton.hidden.subscribe(() => {
            // Lógica después de cerrar el modal
            this.getListDetail(this.loan.iIdPrestamo);
        });
    }

    onAllPayLoan() {
        const modalPayAll = this.modalService.open(PayAllComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
            centered: true
        });
        modalPayAll.componentInstance.loan = this.loan;
        modalPayAll.hidden.subscribe(() => {
            // Lógica después de cerrar el modal
            this.getListDetail(this.loan.iIdPrestamo);
        });
    }

    // Método para manejar la selección/deselección de todos los elementos
    selectAll(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        this.listDetail.forEach(elemento => {
            console.log('elemento', elemento);
            if (checked && elemento.estado !== 'PAGADO') {
                this.selectAlls[elemento.numero] = true;
            } else {
                delete this.selectAlls[elemento.numero];
            }
            console.log(this.selectAlls);
        });
    }

    // Método para manejar la selección/deselección individual
    selectItem(id: number, event: Event) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            // Si el checkbox está marcado, actualiza el estado
            this.selectAlls[id] = true;
        } else {
            // Si el checkbox no está marcado, elimina la entrada del objeto
            delete this.selectAlls[id];
        }
        console.log(this.selectAlls);
    }


    /**
     * modal lista detalle pago
     */
    openModalDetail(item) {
        const modalDetailPay = this.modalService.open(DetailPayComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
            centered: true
        });
        modalDetailPay.componentInstance.detailPay = item;
        modalDetailPay.componentInstance.loan = this.loan;

        modalDetailPay.result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            },(reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
        modalDetailPay.hidden.subscribe(() => {
            // Lógica después de cerrar el modal
            this.getListDetail(this.loan.iIdPrestamo);
        });
    }

    openModalPayPDF(numberId:number) {
        const modalPdf = this.modalService.open(PdfViewerPayComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true});
        modalPdf.componentInstance.loanId = this.loan.iIdPrestamo;
        modalPdf.componentInstance.numberId = numberId;
        modalPdf.componentInstance.payId = 0;
        modalPdf.componentInstance.title = 'TICKET DE PAGO';
        modalPdf.componentInstance.send = false;
        modalPdf.result.then ((result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
    }

    openModal(constPDF: number, title:string) {
        const modalPDF = this.modalService.open(PdfViewerComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'xl',
                centered: true,
                backdrop: 'static',
                animation: true,
                backdropClass: 'modal-backdrop',
            });
        modalPDF.componentInstance.loanId =  this.loan.iIdPrestamo;
        modalPDF.componentInstance.typePDF = constPDF;
        modalPDF.componentInstance.title = title;
        modalPDF.result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
    }
}
