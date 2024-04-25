import {ChangeDetectorRef, Component, OnInit, inject} from '@angular/core';
import {NgbCalendar, NgbDateParserFormatter, NgbDate, NgbModal, NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Constants} from 'src/app/shared/common/constants';
import {DismissReason} from 'src/app/shared/common/dismissReason';
import {ListDetailResponse} from 'src/app/shared/models/listDetailResponse';
import {LoanRequest} from 'src/app/shared/models/loanRequest';
import {LoansReponse} from 'src/app/shared/models/loanResponse';
import {Result} from 'src/app/shared/models/result.interface';
import {GeneralService} from 'src/app/shared/service/General/general.service';
import {BankService} from 'src/app/shared/service/bank/bank.service';
import {LoanService} from 'src/app/shared/service/loans/loan.service';
import {ReportService} from 'src/app/shared/service/reports/report.service';
import {UserService} from 'src/app/shared/service/users/user.service';
import {ZoneService} from 'src/app/shared/service/zone/zone.service';
import Swal from 'sweetalert2';
import {ListPayComponent} from '../components/list-pay/list-pay.component';

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
    fromDate: NgbDate | null = null;
    toDate: NgbDate | null = null;

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

    DELIMITER: string = '-';
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
        const startDate = this.fromDate === null ? '' : this.fromDate.year + this.DELIMITER + this.fromDate.month + this.DELIMITER + this.fromDate.day;
        const endDate = this.toDate === null ? '' : this.toDate.year + this.DELIMITER + this.toDate.month + this.DELIMITER + this.toDate.day;
        const data: LoanRequest = {
            collector: this.collector === null ? 0 : this.collector,
            customer: this.customer === '' ? '' : this.customer,
            typeDocument: this.typeDocument === null ? 0 : this.typeDocument,
            statePay: this.statePay === null ? 0 : this.statePay,
            currency: this.currency === null ? 0 : this.currency,
            zoneId: this.zoneId === null ? 0 : this.zoneId,
            startDate: startDate === null ? '' : startDate,
            endDate: endDate === null ? '' : endDate,
            paymentMethod: this.formePay === null ? 0 : this.formePay,
            numPage: $event,
            allPage: 0,
            cantFile: this.pageSize
        };

        console.log(data);
        this.apiLoan.getLoanReport(data).subscribe((res: Result) => {
            console.log(res);
            this.listReport = res.payload.data;
            this.collectionSize = res.payload.total;
            this.totalRecords = res.payload.total;
            this.totalPage = res.payload.totalPage;
        });
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    isHovered(date: NgbDate) {
        return (
            this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
        );
    }

    isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return (
            date.equals(this.fromDate) ||
            (this.toDate && date.equals(this.toDate)) ||
            this.isInside(date) ||
            this.isHovered(date)
        );
    }

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }

    onClean() {
        this.fromDate = null;
        this.toDate = null;
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
            this.getLoanReport();
        });
    }

    prepareteList() {
        let startDate = this.fromDate === null ? '' : this.fromDate.year + this.DELIMITER + this.fromDate.month + this.DELIMITER + this.fromDate.day;

        let endDate = this.toDate === null ? '' : this.toDate.year + this.DELIMITER + this.toDate.month + this.DELIMITER + this.toDate.day;

        let data: LoanRequest = {
            collector: this.collector === null ? 0 : this.collector,
            customer: this.customer === '' ? '' : this.customer,
            typeDocument: this.typeDocument === null ? 0 : this.typeDocument,
            statePay: this.statePay === null ? 0 : this.statePay,
            currency: this.currency === null ? 0 : this.currency,
            zoneId: this.zoneId === null ? 0 : this.zoneId,
            startDate: startDate === null ? '' : startDate,
            endDate: endDate === null ? '' : endDate,
            paymentMethod: this.formePay === null ? 0 : this.formePay,
            numPage: this.page,
            allPage: 0,
            cantFile: this.pageSize
        };
        return data;
    }
}
