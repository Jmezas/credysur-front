import { Component, OnInit, inject } from '@angular/core';
import { NgbCalendar, NgbDateParserFormatter, NgbDate, NgbModal, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/shared/common/constants';
import { DismissReason } from 'src/app/shared/common/dismissReason';
import { ListDetailPayResponse } from 'src/app/shared/models/listDetailPayResponse';
import { ListDetailResponse } from 'src/app/shared/models/listDetailResponse';
import { LoanRequest } from 'src/app/shared/models/loanRequest';
import { LoansReponse } from 'src/app/shared/models/loanResponse';
import { Result } from 'src/app/shared/models/result.interface';
import { GeneralService } from 'src/app/shared/service/General/general.service';
import { BankService } from 'src/app/shared/service/bank/bank.service';
import { LoanService } from 'src/app/shared/service/loans/loan.service';
import { UserService } from 'src/app/shared/service/users/user.service';
import { ZoneService } from 'src/app/shared/service/zone/zone.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-loan',
  templateUrl: './list-loan.component.html',
  styleUrls: ['./list-loan.component.scss'],
  
})
export class ListLoanComponent implements OnInit {
  listReport: LoansReponse[] = [];
  page = 1;
  pageSize = 10;
  searchText: string = "";
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
  customer: string = "";
  nroDocument: string = "";
  statePay: number = null;

  DELIMITER: string = "-";
  closeResult: string;
  //detalle
  listDetail: ListDetailResponse[] = [];
  DocumenDetail: string = "";
  serieDetail: string = "";
  customerDetail: string = "";
  totalDetail: number = 0;
  selectAlls: { [key: number]: boolean } = {};
  idPay: number = 0;

  //amortizar
  listTypePay: any[] = [];
  listBank: any[] = [];
  isVisibledBank: boolean = false;
  isVisibledMora: boolean = false;
  fromDateAmortizar: NgbDate = this.calendar.getToday();
  dataAmortizar = [];
  totalPay: number = 0;
  typePay: number = 1;
  typeBank: number = null;
  moraPorcentaje: number = 0;
  remainingPayment: number = 0;
  remainingPaymentPorcentje: number = 0;
  modalAmortizacion: any;

  //detalle pago
  listDetailPay: ListDetailPayResponse[] = [];
  datePay: string = "";
  modalPay: any;
  numberDocument: string = "";
  payDateDetail: string = "";
  payTotalDetail: number = 0;
  payCuota: number = 0;
  payPago: number = 0;
  payMount: number = 0;
  payMountRest: number = 0;
  numberPay: number = 0;
  idDetailPay: number = 0;
  numberDetailPay: number = 0;
  constants: Constants = new Constants();
  constructor(
    private apiLoan: LoanService,
    private apiUser: UserService,
    private apiZone: ZoneService,
    private apiGeneral: GeneralService,
    private modalService: NgbModal,
    private apiBank: BankService,
    private toastr: ToastrService,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
  ) { }

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
    this.apiGeneral.dropdownList(3).subscribe((res: any) => {
      this.formeList = res;
    });
  }

  getLoanReport() {

    let startDate = this.fromDate === null ? "" : this.fromDate.year + this.DELIMITER + this.fromDate.month + this.DELIMITER + this.fromDate.day;

    let endDate = this.toDate === null ? "" : this.toDate.year + this.DELIMITER + this.toDate.month + this.DELIMITER + this.toDate.day;

    let data: LoanRequest = {
      collector: this.collector === null ? 0 : this.collector,
      customer: this.customer === "" ? "" : this.customer,
      typeDocument: this.typeDocument === null ? 0 : this.typeDocument,
      statePay: this.statePay === null ? 0 : this.statePay,
      currency: this.currency === null ? 0 : this.currency,
      zoneId: this.zoneId === null ? 0 : this.zoneId,
      startDate: startDate === null ? "" : startDate,
      endDate: endDate === null ? "" : endDate,
      paymentMethod: this.formePay === null ? 0 : this.formePay,
      numPage: this.page,
      allPage: 0,
      cantFile: this.pageSize
    };

    this.apiLoan.getLoanReport(data).subscribe((res: Result) => {
      console.log(res);
      this.page = 1;
      this.listReport = res.payload.data;
      this.collectionSize = res.payload.total;
      this.totalRecords = res.payload.total;
      this.totalPage = res.payload.totalPage;
    });
  }
  loadPage($event) {

    let startDate = this.fromDate === null ? "" : this.fromDate.year + this.DELIMITER + this.fromDate.month + this.DELIMITER + this.fromDate.day;

    let endDate = this.toDate === null ? "" : this.toDate.year + this.DELIMITER + this.toDate.month + this.DELIMITER + this.toDate.day;

    let data: LoanRequest = {
      collector: this.collector === null ? 0 : this.collector,
      customer: this.customer === "" ? "" : this.customer,
      typeDocument: this.typeDocument === null ? 0 : this.typeDocument,
      statePay: this.statePay === null ? 0 : this.statePay,
      currency: this.currency === null ? 0 : this.currency,
      zoneId: this.zoneId === null ? 0 : this.zoneId,
      startDate: startDate === null ? "" : startDate,
      endDate: endDate === null ? "" : endDate,
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
    this.customer = "";
    this.nroDocument = "";
    this.statePay = null;
    this.getLoanReport();
  }

  onDelete(id: number) {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ¡borrarlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiLoan.delete(id).subscribe({
          next: (response) => {
            this.getLoanReport()
            this.toastr.success(this.constants.MESSAGE_SUCCESS_DELETE, this.constants.TITLE_SUCCESS)
          },
          error: (err) => {
            this.toastr.error(this.constants.MESSAGE_ERROR_DELETE, this.constants.TITLE_DELETE)
          }
        })
      }
    });
  }

  /**
   * modal
   */
  openModal(content, item: LoansReponse) {
    this.onListPago(item);
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${new DismissReason(reason)}`;
      }
    );
  }
  /*
  * detalla de pago
  */
  onListPago(item: LoansReponse) {
    this.numberDocument = item.documento;
    this.DocumenDetail = item.documento;
    this.serieDetail = item.serie;
    this.customerDetail = item.sRazonSocial;
    this.totalDetail = parseFloat(item.nTotal.toFixed(2));
    this.idPay = item.iIdPrestamo;
    this.payTotalDetail = item.nTotal;
    this.selectAlls = {};
    this.getListDetail(this.idPay);
    this.getListTypePay();
  }
  getListDetail(id: number) {
    this.apiLoan.getListDetail(id).subscribe({
      next: (res: Result) => {
        console.log(res);
        this.listDetail = res.payload.data;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log("complete");
      },
    })
  }
  // Método para manejar la selección/deselección de todos los elementos
  selectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.listDetail.forEach(elemento => {
      if (checked) {
        this.selectAlls[elemento.numero] = true;
      }
      else {
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
   * amortizar pago
   */
  openModalAmortizar(content) {
    if (Object.keys(this.selectAlls).length === 0) {
      Swal.fire({
        title: "¡Error!",
        text: "Seleccione al menos un detalle de pago",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    this.onCleamAmortizar();
    this.getListBank();
    this.onAmortizar();
    this.modalAmortizacion = this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true });
    this.modalAmortizacion.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${new DismissReason(reason)}`;
      }
    );
  }

  /**
   * seleccionar tipo de banco
   * @param event checkbox
   */
  onTypePayChange(event) {
    if (event === 2) {
      this.isVisibledBank = true;
    } else {
      this.isVisibledBank = false;
    }
  }

  /**
    * aplicar mora 
    * @param event checkbox
    */
  onChangeMora(event) {
    const value = event.target.value;
    if (value === "true") {
      this.isVisibledMora = true;
    } else {
      this.isVisibledMora = false;
      this.remainingPaymentPorcentje = 0;
      this.moraPorcentaje = 0;
    }
  }

  /**
   * lista de tipo de pago
   */
  getListTypePay() {
    this.apiGeneral.dropdownList(6).subscribe((res: any) => {
      this.listTypePay = res;
    });
  }

  getListBank() {
    this.apiBank.getAll().subscribe((res: Result) => {
      this.listBank = res.payload.data;
    });
  }

  onAmortizar() {
    this.dataAmortizar = [];
    this.listDetail.filter((item) => this.selectAlls[item.numero])
      .forEach((item) => {
        this.dataAmortizar.push({
          number: item.numero,
          pay: item.totales,
          monto: item.pago,
          payDate: item.fecha,
        });
        this.totalPay += item.totales;
        this.remainingPayment += item.pago;
      });
    console.log(this.dataAmortizar);
  }

  onCalculateInteres() {
    this.remainingPaymentPorcentje = this.totalPay * (this.moraPorcentaje / 100)
  }

  onSaveAmortizar() {
    this.dataAmortizar.map((item) => {
      item.idLoan = this.idPay,
        item.typeBank = this.typeBank === null ? 0 : this.typeBank;
      item.mora = this.isVisibledMora ? "Si" : "No";
      item.moraPor = this.moraPorcentaje;
      item.typePay = this.typePay;
      item.type = 2;
      item.payDate = this.fromDateAmortizar.year + this.DELIMITER + this.fromDateAmortizar.month + this.DELIMITER + this.fromDateAmortizar.day;
      item.accumulatedAmount = this.remainingPayment;
      item.accumulatedAmountPorcentaje = this.remainingPaymentPorcentje;
    });
    console.log(this.dataAmortizar);
    this.apiLoan.paymentAmortization(this.dataAmortizar).subscribe((res: Result) => {
      console.log(res);
      Swal.fire({
        title: "¡Exito!",
        text: res.payload.data,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      this.getListDetail(this.idPay);
      this.getLoanReport();
      this.modalAmortizacion.close();
    });

  }

  onCleamAmortizar() {
    this.isVisibledBank = false;
    this.isVisibledMora = false;
    this.fromDateAmortizar = this.calendar.getToday();
    this.dataAmortizar = [];
    this.totalPay = 0;
    this.typePay = 1;
    this.typeBank = null;
    this.moraPorcentaje = 0;
    this.remainingPayment = 0;
    this.remainingPaymentPorcentje = 0;
  }

  /**
   * modal detalle pago 
   */

  openModalPago(content, item: ListDetailResponse) {
    console.log(item);
    this.payDateDetail = item.fecha;
    this.payCuota = item.totales - item.pago;
    this.payPago = item.pago;
    this.numberPay = item.numero;
    this.payMount = 0;
    this.remainingPaymentPorcentje = 0;
    this.moraPorcentaje = 0;
    this.isVisibledMora = false;
    this.datePay= this.today;
    this.modalPay = this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true });
    this.modalPay.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${new DismissReason(reason)}`;
      }
    );
  }

  /**
   * calcular monto
   */
  onChangeMonto() {
    debugger;
    const value = parseFloat(this.payMount.toString());
    if (value > this.payCuota) {
      this.payMount = this.payCuota;
      this.payMountRest = value - this.payCuota;
      this.toastr.info("El monto es mayor a la cuota | el monto restante es " + this.payMountRest.toFixed(2), "¡Error!");
      return;
    }
    if (value < 0) {
      this.payMount = 0;
      this.toastr.info("El monto no puede ser negativo", "¡Error!");
      this.moraPorcentaje = 0;
      this.remainingPaymentPorcentje = this.payMount * (this.moraPorcentaje / 100)
      return;
    }
    if (value === this.payCuota) {
      this.moraPorcentaje = 0;
      this.payMountRest = 0;
      this.remainingPaymentPorcentje = this.payMount * (this.moraPorcentaje / 100)
      return;
    }
    this.payMount = value;

  }
  onCalculateInterPay() {
    this.remainingPaymentPorcentje = this.payMount * (this.moraPorcentaje / 100)
  }

  get today() {
		return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
	}
  onSavePay() {
    console.log(this.datePay);
    let data = {
      idLoan: this.idPay,
      number: this.numberPay,
      type: 1,
      pay: this.payMount,
      mora: this.isVisibledMora ? "Si" : "No",
      moraPor: this.moraPorcentaje,
      typePay: this.typePay,
      typeBank: this.typeBank === null ? 0 : this.typeBank,
      payDate: this.datePay['year'] + this.DELIMITER + this.datePay['month'] + this.DELIMITER + this.datePay['day'],
      accumulatedAmount: this.payMountRest,
      accumulatedAmountPorcentaje: this.remainingPaymentPorcentje
    }
    console.log(this.datePay);
    this.apiLoan.payment(data).subscribe((res: Result) => {
      console.log(res);
      Swal.fire({
        title: "¡Exito!",
        text: res.payload.data,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      this.getListDetail(this.idPay);
      this.getLoanReport();
      this.modalPay.close();
    });
  }
  /**
   * modal lista detalle pago
   */
  openModalDetail(content, item: LoansReponse) {
    console.log(item);
    this.getDetailPay(this.idPay, item.numero);
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${new DismissReason(reason)}`;
      }
    );
  }

  getDetailPay(id: number, number: number) {
    this.idDetailPay = id;
    this.numberDetailPay = number;
    this.apiLoan.getListDetailPay(id, number).subscribe({
      next: (res: Result) => {
        console.log("pago...", res)
        this.listDetailPay = res.payload.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onDeletePay(id: number) {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ¡borrarlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        let DeleteData = {
          idPago: id,
          idPrestamo: this.idDetailPay,
          numberPay: this.numberDetailPay,
          user: 'admin'
        }
        this.apiLoan.deleteDetailPay(DeleteData).subscribe({
          next: (res) => {
            this.getDetailPay(this.idDetailPay, this.numberDetailPay);
            this.getListDetail(this.idDetailPay);
            console.log('resultao del elimano', res)
            this.toastr.success(this.constants.MESSAGE_SUCCESS_DELETE, this.constants.TITLE_SUCCESS);
          }
        })
      }
    });
  }
}
