import {Component, inject, Input, OnInit} from '@angular/core';
import {ReportService} from '../../service/reports/report.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    pdfSrc: string;
    @Input() loanId: number;
    @Input() typePDF: number;
    @Input() title:string;
    constructor(private apiReport: ReportService) {
    }

    ngOnInit() {
        this.onSeePDF(this.loanId, this.typePDF);
    }

    onSeePDF(idFile: number, typePDF: number) {
        this.apiReport.getReportLoanPDF(idFile, typePDF).subscribe((response) => {
            console.log(response);
            const fileURL = URL.createObjectURL(response);
            console.log('this.pdfSrc', fileURL.split('blob:')[1]);
            this.pdfSrc = fileURL;
        });
    }
}
