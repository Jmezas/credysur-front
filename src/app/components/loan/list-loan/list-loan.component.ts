import {ChangeDetectorRef, Component, OnInit, inject} from '@angular/core';
import {NgbCalendar, NgbDateParserFormatter, NgbDate, NgbModal, NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Constants} from 'src/app/shared/common/constants';
import {DismissReason} from 'src/app/shared/common/dismissReason';
import {Result} from 'src/app/shared/models/result.interface';
import {GeneralService} from 'src/app/shared/service/General/general.service';
import {LoanService} from 'src/app/shared/service/loans/loan.service';
import {ReportService} from 'src/app/shared/service/reports/report.service';
import {UserService} from 'src/app/shared/service/users/user.service';
import {ZoneService} from 'src/app/shared/service/zone/zone.service';
import Swal from 'sweetalert2';
import {ListPayComponent} from '../components/list-pay/list-pay.component';
import {LoanRequest, LoansReponse} from '../../../shared/models/loan.interface';

@Component({
    selector: 'app-list-loan',
    templateUrl: './list-loan.component.html',
    styleUrls: ['./list-loan.component.scss'],

})
export class ListLoanComponent implements OnInit {
    listReport: LoansReponse[] = [];
    page = 1;
    pageSize = 10;
    searchText: string = '';
    totalRecords: number;
    totalPage: number;
    collectionSize = 0;

    calendar = inject(NgbCalendar);
    formatter = inject(NgbDateParserFormatter);

    hoveredDate: NgbDate | null = null;
    fromDateEmision: NgbDate | null = null;
    toDateEmision: NgbDate | null = null;

    fromDatePay: NgbDate | null = null;
    toDatePay: NgbDate | null = null;

    zoneList = [];
    collectoList = [];
    documentList = [];
    formeList = [];
    currencyList = [];
    stateList = [];

    zoneId: number = null;
    collector: number = null;
    typeDocument: number = null;
    currency: number = null;
    formePay: number = null;
    customer: string = '';
    nroDocument: string = '';
    statePay: number = null;

    closeResult: string;

    //detalle
    selectAlls: { [key: number]: boolean } = {};

    numberDocument: string = '';
    discount: number = 0;
    constants: Constants = new Constants();

    constructor(
        private apiLoan: LoanService,
        private apiUser: UserService,
        private apiZone: ZoneService,
        private apiGeneral: GeneralService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private apiReport: ReportService,
    ) {
    }

    ngOnInit() {
        this.getLoanReport();
        this.getCollections();
        this.getZone();
        this.getDocument();
        this.getState();
        this.getCurrency();
        this.getTypePay();
        console.log(this.selectAlls);
    }

    getCollections() {
        this.apiUser.getUser().subscribe(
            (res: Result) => {
                this.collectoList = res.payload.data;
            }
        );
    }

    getZone() {
        this.apiZone.getAll().subscribe((res: Result) => {
            this.zoneList = res.payload.data;
        });
    }

    getDocument() {
        this.apiGeneral.dropdownList(1).subscribe((res: any) => {

            this.documentList = res;
        });
    }

    getState() {
        this.apiGeneral.dropdownList(5).subscribe((res: any) => {
            this.stateList = res;
        });
    }

    getCurrency() {
        this.apiGeneral.dropdownList(2).subscribe((res: any) => {
            this.currencyList = res;
        });
    }

    getTypePay() {
        this.apiGeneral.dropdownList(3).subscribe((res: any) => {
            this.formeList = res;
        });
    }

    donwloadExcel() {
        let data = this.prepareteList();
        this.apiReport.postReportExcel(data).subscribe((res: any) => {
            console.log(res);
            const url = window.URL.createObjectURL(res);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'reporte.xlsx';
            link.click();
        });
    }

    getLoanReport() {
        const data = this.prepareteList();
        console.log(data);
        this.apiLoan.getLoanReport(data).subscribe((res: Result) => {
            this.page = 1;
            this.listReport = res.payload.data;
            this.collectionSize = res.payload.total;
            this.totalRecords = res.payload.total;
            this.totalPage = res.payload.totalPage;
        });
    }

    loadPage($event: any) {

        this.page = $event;
        const data = this.prepareteList();
        this.apiLoan.getLoanReport(data).subscribe((res: Result) => {
            console.log(res);
            this.listReport = res.payload.data;
            this.collectionSize = res.payload.total;
            this.totalRecords = res.payload.total;
            this.totalPage = res.payload.totalPage;
        });
    }

    onDateSelectionEmition(date: NgbDate) {
        if (!this.fromDateEmision && !this.toDateEmision) {
            this.fromDateEmision = date;
        } else if (this.fromDateEmision && !this.toDateEmision && date && date.after(this.fromDateEmision)) {
            this.toDateEmision = date;
        } else {
            this.toDateEmision = null;
            this.fromDateEmision = date;
        }
    }

    isHoveredEmition(date: NgbDate) {
        return (
            this.fromDateEmision && !this.toDateEmision && this.hoveredDate && date.after(this.fromDateEmision) && date.before(this.hoveredDate)
        );
    }

    isInsideEmition(date: NgbDate) {
        return this.toDateEmision && date.after(this.fromDateEmision) && date.before(this.toDateEmision);
    }

    isRangeEmition(date: NgbDate) {
        return (
            date.equals(this.fromDateEmision) ||
            (this.toDateEmision && date.equals(this.toDateEmision)) ||
            this.isInsideEmition(date) ||
            this.isHoveredEmition(date)
        );
    }

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }

    //pago
    onDateSelectionPay(date: NgbDate) {
        if (!this.fromDatePay && !this.toDatePay) {
            this.fromDatePay = date;
        } else if (this.fromDatePay && !this.toDatePay && date && date.after(this.fromDatePay)) {
            this.toDatePay = date;
        } else {
            this.toDatePay = null;
            this.fromDatePay = date;
        }
    }

    isHoveredPay(date: NgbDate) {
        return (
            this.fromDatePay && !this.toDatePay && this.hoveredDate && date.after(this.fromDatePay) && date.before(this.hoveredDate)
        );
    }

    isInsidePay(date: NgbDate) {
        return this.toDatePay && date.after(this.fromDatePay) && date.before(this.toDatePay);
    }

    isRangePay(date: NgbDate) {
        return (
            date.equals(this.fromDatePay) ||
            (this.toDatePay && date.equals(this.toDatePay)) ||
            this.isInsideEmition(date) ||
            this.isHoveredEmition(date)
        );
    }


    onClean() {
        this.fromDateEmision = null;
        this.toDateEmision = null;
        this.fromDatePay = null;
        this.toDatePay = null;
        this.zoneId = null;
        this.collector = null;
        this.typeDocument = null;
        this.currency = null;
        this.formePay = null;
        this.customer = '';
        this.nroDocument = '';
        this.statePay = null;
        this.getLoanReport();
    }

    onDelete(id: number) {
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
                this.apiLoan.delete(id).subscribe({
                    next: (response) => {
                        this.getLoanReport();
                        this.toastr.success(this.constants.MESSAGE_SUCCESS_DELETE, this.constants.TITLE_SUCCESS);
                    },
                    error: (err) => {
                        this.toastr.error(this.constants.MESSAGE_ERROR_DELETE, this.constants.TITLE_DELETE);
                    }
                });
            }
        });
    }

    /**
     * modal
     */
    openModal(item: LoansReponse) {
        console.log('antes del modal', item);
        const modalRefPayList = this.modalService.open(ListPayComponent, {ariaLabelledBy: 'modal-basic-title', size: 'xl', centered: true});
        // Pasar datos al componente modal
        modalRefPayList.componentInstance.loan = item;


        // Manejar el resultado del modal
        modalRefPayList.result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
        modalRefPayList.hidden.subscribe(() => {
            this.loadPage(this.page);
        });
    }

    prepareteList() {
        const startDate = this.fromDateEmision === null ? '' : `${this.fromDateEmision.year}-${this.fromDateEmision.month}-${this.fromDateEmision.day}`;
        const endDate = this.toDateEmision === null ? '' : `${this.toDateEmision.year}-${this.toDateEmision.month}-${this.toDateEmision.day}`;
        const startDatePay = this.fromDatePay === null ? '' : `${this.fromDatePay.year}-${this.fromDatePay.month}-${this.fromDatePay.day}`;
        const endDatePay = this.toDatePay === null ? '' : `${this.toDatePay.year}-${this.toDatePay.month}-${this.toDatePay.day}`;

        let data: LoanRequest = {
            collector: this.collector === null ? 0 : this.collector,
            customer: this.customer === '' ? '' : this.customer,
            typeDocument: this.typeDocument === null ? 0 : this.typeDocument,
            statePay: this.statePay === null ? 0 : this.statePay,
            currency: this.currency === null ? 0 : this.currency,
            zoneId: this.zoneId === null ? 0 : this.zoneId,
            startDate: startDate === null ? '' : startDate,
            endDate: endDate === null ? '' : endDate,
            startDatePay: startDatePay === null ? '' : startDatePay,
            endDatePay: endDatePay === null ? '' : endDatePay,
            paymentMethod: this.formePay === null ? 0 : this.formePay,
            numPage: this.page,
            allPage: 0,
            cantFile: this.pageSize
        };
        return data;
    }
}
