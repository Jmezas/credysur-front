import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ListDetailPayResponse} from '../../../../shared/models/listDetailPayResponse';
import {Result} from '../../../../shared/models/result.interface';
import {LoanService} from '../../../../shared/service/loans/loan.service';
import {ListDetailResponse} from '../../../../shared/models/listDetailResponse';
import {LoansReponse} from '../../../../shared/models/loanResponse';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {Constants} from 'src/app/shared/common/constants';

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

    constants: Constants = new Constants();

    constructor(
        private apiLoan: LoanService,
        private toastr: ToastrService,
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
