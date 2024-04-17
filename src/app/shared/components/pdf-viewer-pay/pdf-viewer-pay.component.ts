import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {ReportService} from '../../service/reports/report.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-pdf-viewer-pay',
    standalone: true,
    imports: [CommonModule, NgxExtendedPdfViewerModule],
    templateUrl: './pdf-viewer-pay.component.html',
    styleUrl: './pdf-viewer-pay.component.scss'
})
export class PdfViewerPayComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    pdfSrc: string;
    @Input() loanId: number;
    @Input() numberId: number;
    @Input() payId: number;
    @Input() title: string;

    constructor(private apiReport: ReportService) {
    }

    ngOnInit() {
        this.onSeePDF(this.loanId, this.numberId, this.payId);
    }

    onSeePDF(idFile: number, NumberId: number, PayId: number) {
        this.apiReport.getReportPayLoanPDF(idFile, NumberId, PayId).subscribe((response) => {
            console.log(response);
            const fileURL = URL.createObjectURL(response);
            console.log('this.pdfSrc', fileURL.split('blob:')[1]);
            this.pdfSrc = fileURL;
        });
    }
}
