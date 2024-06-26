import {Component, OnInit, inject} from '@angular/core';
import {LoanService} from 'src/app/shared/service/loans/loan.service';
import {DailyRequest} from 'src/app/shared/models/dailyRequest';
import {Result} from 'src/app/shared/models/result.interface';
import {UserService} from 'src/app/shared/service/users/user.service';
import {ZoneService} from 'src/app/shared/service/zone/zone.service';
import {GeneralService} from 'src/app/shared/service/General/general.service';
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {ReportService} from '../../shared/service/reports/report.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
    listReport = [];
    page = 1;
    pageSize = 10;
    searchText: string = '';
    totalRecords: number;
    totalPage: number;
    collectionSize = 0;

    noResultados = false;
    totales = {
        Pagado: 0,
        Pendiente: 0,
        Mora: 0,
        Acomulado: 0,
        discount: 0
    };
    totalPayday: number = 0;
    discountTotal: number = 0;

    calendar = inject(NgbCalendar);
    formatter = inject(NgbDateParserFormatter);

    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate | null = this.calendar.getToday();
    toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 0);

    fromDatePay: NgbDate | null = null;
    toDatePay: NgbDate | null = null;

    fromDateCuota: NgbDate | null = null;
    toDateCuota: NgbDate | null = null;

    pagosProcesados = [];
    zoneList = [];
    collectoList = [];
    documentList = [];
    payList = [];
    currencyList = [];
    stateList = [];

    zoneId: number = null;
    collector: number = null;
    typeDocument: number = null;
    documentPay: number = null;
    currency: number = null;
    typePay: number = null;
    customer: string = '';
    nroDocument: string = '';
    nroLoan: number = null;
    statePay: number = null;

    DELIMITER: string = '-';

    constructor(
        private apiLoan: LoanService,
        private apiUser: UserService,
        private apiZone: ZoneService,
        private apiGeneral: GeneralService,
        private apiReport: ReportService
    ) {
    }

    ngOnInit() {
        this.getDailyReport();
        this.getCollections();
        this.getZone();
        this.getDocument();
        this.getState();
        this.getCurrency();
        this.getTypePay();
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
        this.apiGeneral.dropdownList(6).subscribe((res: any) => {
            this.payList = res;
        });
    }


    getDailyReport() {
        let data = this.prepareteList();
        this.totales = {
            Pagado: 0,
            Pendiente: 0,
            Mora: 0,
            Acomulado: 0,
            discount: 0
        };

        this.apiLoan.getDailyReport(data).subscribe(
            (res: Result) => {
                console.log('res', res);
                this.listReport = res.payload.data;
                this.collectionSize = res.payload.total;
                this.totalRecords = res.payload.total;
                this.totalPage = res.payload.totalPage;
                this.noResultados = this.listReport.length === 0;
                this.pagosProcesados = [];
                this.totalPayday = this.listReport[0].totalPayDay;
                this.discountTotal = this.listReport[0].discountTotal;
                this.listReport.forEach((item) => {
                    // Comprobar si es un nuevo grupo de 'iIdPrestamo'
                    if (!this.pagosProcesados.some(p => p.iIdPrestamo === item.iIdPrestamo)) {
                        // Insertar una fila de encabezado para el nuevo grupo
                        this.pagosProcesados.push({
                            esEncabezado: true,
                            sRazonSocial: item.sRazonSocial,
                            iIdPrestamo: item.iIdPrestamo,
                            zona: item.zona,
                            serie: item.serie,
                        });
                    }
                    // Añadir el item actual al array procesado
                    this.pagosProcesados.push({...item, esEncabezado: false});
                });


                this.totales = this.listReport.reduce((acc, item) => {
                    acc.Pagado += item.nMonto;
                    acc.Pendiente += item.PendienteDetalle;
                    acc.Mora += item.moraPor;
                    acc.Acomulado += item.montoAcomulado;
                    acc.discount += item.discount;
                    return acc;
                }, {...this.totales});
            }
        );
    }

    loadPage($event) {
        this.page = $event;
        let data = this.prepareteList();

        this.totales = {
            Pagado: 0,
            Pendiente: 0,
            Mora: 0,
            Acomulado: 0,
            discount: 0
        };
        this.apiLoan.getDailyReport(data).subscribe(
            (res: Result) => {
                this.listReport = res.payload.data;
                this.collectionSize = res.payload.total;
                this.totalRecords = res.payload.total;
                this.totalPage = res.payload.totalPage;
                this.noResultados = this.listReport.length === 0;
                this.pagosProcesados = [];

                this.listReport.forEach((item) => {
                    // Comprobar si es un nuevo grupo de 'iIdPrestamo'
                    if (!this.pagosProcesados.some(p => p.iIdPrestamo === item.iIdPrestamo)) {
                        // Insertar una fila de encabezado para el nuevo grupo
                        this.pagosProcesados.push({
                            esEncabezado: true,
                            sRazonSocial: item.sRazonSocial,
                            iIdPrestamo: item.iIdPrestamo,
                            zona: item.zona,
                            serie: item.serie,
                        });
                    }
                    // Añadir el item actual al array procesado
                    this.pagosProcesados.push({...item, esEncabezado: false});
                });

                this.totales = this.listReport.reduce((acc, item) => {
                    acc.Pagado += item.nMonto;
                    acc.Pendiente += item.PendienteDetalle;
                    acc.Mora += item.moraPor;
                    acc.Acomulado += item.montoAcomulado;
                    acc.discount += item.discount;
                    return acc;
                }, {...this.totales});
            }
        );
    }


    onDateSelection(date: NgbDate) {
        console.log(date);
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
            this.isInside(date) ||
            this.isHovered(date)
        );
    }

    //fecha de cuota
    onDateSelectionCuota(date: NgbDate) {
        if (!this.fromDateCuota && !this.toDateCuota) {
            this.fromDateCuota = date;
        } else if (this.fromDateCuota && !this.toDateCuota && date && date.after(this.fromDateCuota)) {
            this.toDateCuota = date;
        } else {
            this.toDateCuota = null;
            this.fromDateCuota = date;
        }
    }

    isHoveredCuota(date: NgbDate) {
        return (
            this.fromDateCuota && !this.toDateCuota && this.hoveredDate && date.after(this.fromDateCuota) && date.before(this.hoveredDate)
        );
    }

    isInsideCuota(date: NgbDate) {
        return this.toDateCuota && date.after(this.fromDateCuota) && date.before(this.toDateCuota);
    }

    isRangeCuota(date: NgbDate) {
        return (
            date.equals(this.fromDateCuota) ||
            (this.toDateCuota && date.equals(this.toDateCuota)) ||
            this.isInside(date) ||
            this.isHovered(date)
        );
    }

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }

    prepareteList() {
        const formatDate = (date) => date ? `${date.year}-${date.month}-${date.day}` : '';

        let startDate = formatDate(this.fromDate);
        let endDate = formatDate(this.toDate) || startDate;

        let startDatePay = formatDate(this.fromDatePay);
        let endDatePay = formatDate(this.toDatePay) || startDatePay;

        let startDateCuota = formatDate(this.fromDateCuota);
        let endDateCuota = formatDate(this.toDateCuota) || startDateCuota;

        console.log('consoles date', endDatePay);
        console.log('consoles date', endDateCuota);

        let data = {
            collector: this.collector ?? 0,
            customer: this.customer || '',
            typeDocument: this.typeDocument ?? 0,
            documentPay: this.statePay ?? 0,
            currency: this.currency ?? 0,
            zoneId: this.zoneId ?? 0,
            nroDocument: this.nroDocument || '',
            nroLoan: this.nroLoan ?? 0,
            typePay: this.typePay ?? 0,
            startDate: startDate,
            endDate: endDate,
            startDatePay: startDatePay,
            endDatePay: endDatePay,
            startDateCuota: startDateCuota,
            endDateCuota: endDateCuota,
            numPage: this.page,
            allPage: 0,
            cantFile: this.pageSize
        };

        return data;
    }


    donwloadExcel() {
        let data = this.prepareteList();
        this.apiReport.getReportDayEscel(data).subscribe((res: any) => {
            console.log(res);
            const url = window.URL.createObjectURL(res);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'reporte.xlsx';
            link.click();
        });
    }

    onClean() {
        this.collector = null;
        this.customer = '';
        this.typeDocument = null;
        this.statePay = null;
        this.currency = null;
        this.zoneId = null;
        this.nroDocument = '';
        this.nroLoan = null;
        this.typePay = null;
        this.fromDate = null;
        this.toDate = null;
        this.fromDatePay = null;
        this.toDatePay = null;
        this.fromDateCuota = null;
        this.toDateCuota = null;
        this.page = 1;
        this.pageSize = 10;
        this.getDailyReport();
    }
}
