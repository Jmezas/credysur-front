import { Component, OnInit, inject } from '@angular/core';
import { LoanService } from 'src/app/shared/service/loans/loan.service';
import { DailyRequest } from 'src/app/shared/models/dailyRequest';
import { Result } from 'src/app/shared/models/result.interface';
import { UserService } from 'src/app/shared/service/users/user.service';
import { ZoneService } from 'src/app/shared/service/zone/zone.service';
import { GeneralService } from 'src/app/shared/service/General/general.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  listReport = [];
  page = 1;
  pageSize = 10;
  searchText: string = "";
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
  customer: string = "";
  nroDocument: string = "";
  nroLoan: number = null;
  statePay: number = null;

  DELIMITER: string = "-";

  constructor(
    private apiLoan: LoanService,
    private apiUser: UserService,
    private apiZone: ZoneService,
    private apiGeneral: GeneralService
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
    )
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
    let startDate = this.fromDate === null ? "" : this.fromDate.year + this.DELIMITER + this.fromDate.month + this.DELIMITER + this.fromDate.day;

    let endDate = this.toDate === null ? "" : this.toDate.year + this.DELIMITER + this.toDate.month + this.DELIMITER + this.toDate.day;

    let data: DailyRequest = {
      collector: this.collector === null ? 0 : this.collector,
      customer: this.customer === "" ? "" : this.customer,
      typeDocument: this.typeDocument === null ? 0 : this.typeDocument,
      documentPay: this.statePay === null ? 0 : this.statePay,
      currency: this.currency === null ? 0 : this.currency,
      zoneId: this.zoneId === null ? 0 : this.zoneId,
      nroDocument: this.nroDocument === "" ? "" : this.nroDocument,
      nroLoan: this.nroLoan === null ? 0 : this.nroLoan,
      typePay: this.typePay === null ? 0 : this.typePay,
      startDate: startDate,
      endDate: endDate,
      numPage: 1,
      allPage: 0,
      cantFile: this.pageSize
    }

    this.totales = {
      Pagado: 0,
      Pendiente: 0,
      Mora: 0,
      Acomulado: 0,
      discount: 0
    };
    
    this.apiLoan.getDailyReport(data).subscribe(
      (res: Result) => {
        console.log("res", res);
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
          this.pagosProcesados.push({ ...item, esEncabezado: false });
        });
 

        this.totales = this.listReport.reduce((acc, item) => {
          acc.Pagado += item.nMonto;
          acc.Pendiente += item.PendienteDetalle; 
          acc.Mora += item.moraPor;
          acc.Acomulado += item.montoAcomulado;
          acc.discount += item.discount;
          return acc;
        }, { ...this.totales });
      }
    )
  }

  loadPage($event) {
    let startDate = this.fromDate === null ? "" : this.fromDate.year + this.DELIMITER + this.fromDate.month + this.DELIMITER + this.fromDate.day;

    let endDate = this.toDate === null ? "" : this.toDate.year + this.DELIMITER + this.toDate.month + this.DELIMITER + this.toDate.day;

    let data: DailyRequest = {
      collector: this.collector === null ? 0 : this.collector,
      customer: this.customer === "" ? "" : this.customer,
      typeDocument: this.typeDocument === null ? 0 : this.typeDocument,
      documentPay: this.statePay === null ? 0 : this.statePay,
      currency: this.currency === null ? 0 : this.currency,
      zoneId: this.zoneId === null ? 0 : this.zoneId,
      nroDocument: this.nroDocument === "" ? "" : this.nroDocument,
      nroLoan: this.nroLoan === null ? 0 : this.nroLoan,
      typePay: this.typePay === null ? 0 : this.typePay,
      startDate: startDate,
      endDate: endDate,
      numPage: $event,
      allPage: 0,
      cantFile: this.pageSize
    }

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
          this.pagosProcesados.push({ ...item, esEncabezado: false });
        });

        console.log("pagosProcesados", this.pagosProcesados);

        this.totales = this.listReport.reduce((acc, item) => {
          acc.Pagado += item.nMonto;
          acc.Pendiente += item.PendienteDetalle; // Asumiendo que esta propiedad existe
          acc.Mora += item.moraPor;
          acc.Acomulado += item.montoAcomulado;
          acc.discount += item.discount;
          return acc;
        }, { ...this.totales });
      }
    )
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
}
