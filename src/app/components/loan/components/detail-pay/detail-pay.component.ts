import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ListDetailPayResponse} from '../../../../shared/models/listDetailPayResponse';
import {Result} from '../../../../shared/models/result.interface';
import {LoanService} from '../../../../shared/service/loans/loan.service';
import {ListDetailResponse} from '../../../../shared/models/listDetailResponse';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {Constants} from 'src/app/shared/common/constants';
import {PdfViewerPayComponent} from '../../../../shared/components/pdf-viewer-pay/pdf-viewer-pay.component';
import {DismissReason} from '../../../../shared/common/dismissReason';
import {LoansReponse} from '../../../../shared/models/loan.interface';

@Component({
    selector: 'app-detail-pay',
    templateUrl: './detail-pay.component.html',
    styleUrl: './detail-pay.component.scss'
})
export class DetailPayComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    listDetailPay: ListDetailPayResponse[] = [];

    @Input() detailPay: ListDetailResponse;
    @Input() loan: LoansReponse;
    closeResult: string = '';
    constants: Constants = new Constants();

    constructor(
        private apiLoan: LoanService,
        private toastr: ToastrService,
        private modalService: NgbModal,
    ) {

    }

    ngOnInit(): void {
        this.getDetailPay(this.loan.iIdPrestamo, this.detailPay.numero);
    }

    getDetailPay(id: number, number: number) {
        this.apiLoan.getListDetailPay(id, number).subscribe({
            next: (res: Result) => {
                this.listDetailPay = res.payload.data;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
    openModalPayPDF(payId:number) {
        const modalPdf = this.modalService.open(PdfViewerPayComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true});
        modalPdf.componentInstance.loanId = this.loan.iIdPrestamo;
        modalPdf.componentInstance.numberId = this.detailPay.numero;
        modalPdf.componentInstance.payId = payId;
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
                    idPago: id,
                    idPrestamo: this.loan.iIdPrestamo,
                    numberPay: this.detailPay.numero,
                    user: 'admin' //correcion
                };
                this.apiLoan.deleteDetailPay(DeleteData).subscribe({
                    next: (res) => {
                        console.log('resultao del elimano', res);
                        this.activeModal.close();
                        this.toastr.success(this.constants.MESSAGE_SUCCESS_DELETE, this.constants.TITLE_SUCCESS);
                    }
                });
            }
        });
    }
}
