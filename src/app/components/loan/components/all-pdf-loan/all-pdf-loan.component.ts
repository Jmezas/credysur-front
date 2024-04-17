import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DismissReason} from '../../../../shared/common/dismissReason';
import {PdfViewerComponent} from '../../../../shared/components/pdf-viewer/pdf-viewer.component';
import {ConstantPDF} from '../../../../shared/models/Constants';

@Component({
    selector: 'app-all-pdf-loan',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './all-pdf-loan.component.html',
    styleUrl: './all-pdf-loan.component.scss'
})
export class AllPdfLoanComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    @Input() public loanId: number;
    closeResult: string;
    constantPDF = ConstantPDF;

    constructor(
        private modalService: NgbModal,
    ) {
    }

    ngOnInit(): void {

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

        modalPDF.componentInstance.loanId = this.loanId;
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
