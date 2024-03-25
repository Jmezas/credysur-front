import { Component, OnInit, inject } from '@angular/core';
import { Result } from 'src/app/shared/models/result.interface';
import { GeneralService } from 'src/app/shared/service/General/general.service';
import { LoanService } from 'src/app/shared/service/loans/loan.service';
import { NgbCalendar, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from 'src/app/shared/service/customers/customer.service';
@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {

  interes: number = 0;
  cuotas: number = 0;
  monto: number = 0;
  descuento: number = 0;
  montoInicial: number = 0;
  montoTotal: number = 0;
  inicialDiaPago: Date;
  listCuotas: any[] = [];
  serie: string = '';
  numero: string = '';
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);
  fromDateAmortizar: NgbDate = this.calendar.getToday();
  currencyList = [];
  currency: number = null;

  nroCuotas: number = 0;
  interesCuota: number = 0;
  // Variables para el tipo de documento
  typeDocumentList = [];
  typeDocument: number = null;

  // Variables para el tipo de pago
  formeList = [];
  formePay: number = null;

  // Variables para el buscador de clientes
  customerList = [];
  customerId: any = null;
  customerName: string = '';
  address: string = '';
  state = '';
  mountTotal: number = 0;
  
  amortizacion: any[] = [];

  observaciones: string = '';
  totalInteres = 0;
  totalCapital = 0;
  constructor(private apiLoan: LoanService, private apiGeneral: GeneralService, private apiCustomer: CustomerService) { }

  ngOnInit() {
    this.onExampleCalculate();
    this.getSerie();
    this.getCurrency();
    this.getTypedocument();
    this.getTypePay();
  }
  getSerie() {
    this.apiLoan.getserie().subscribe((data: Result) => {
      console.log(data);
      this.serie = data.payload.data.serie;
      this.numero = data.payload.data.codigo;
    });
  }

  getCurrency() {
    this.apiGeneral.dropdownList(2).subscribe((res: any) => {
      this.currencyList = res;
      this.currency = this.currencyList[0].code;
    });
  }
  getTypedocument() {
    this.apiGeneral.dropdownList(1).subscribe((res: any) => {
      this.typeDocumentList = res;
      this.typeDocument = this.typeDocumentList[0].code;
    });
  }

  getTypePay() {
    this.apiGeneral.dropdownList(3).subscribe((res: any) => {
      this.formeList = res;
    });
  }

  onCalculate() {
    this.calcularCuotaPrestamo_v1(this.monto, this.interes, this.cuotas);
  }

  calcularCuotaPrestamo(monto: number, tem: number, n: number): number {
    if (tem <= 0 || n <= 0) {
      throw new Error("La Tasa Efectiva Mensual y el número de pagos deben ser mayores que 0.");
    }

    const factorPotencia = Math.pow(1 + tem, n);
    const cuota = (monto * tem * factorPotencia) / (factorPotencia - 1);
    return cuota;
  }

  onExampleCalculate() {
    // Ejemplo de uso:
    try {
      const montoPrestamo = 1000; // Monto del préstamo, por ejemplo 10,000
      const tasaEfectivaMensual = 0.2; // TEM de 5%
      const totalPagos = 5; // 12 cuotas (por ejemplo, un año de pagos mensuales)

      const cuota = this.calcularCuotaPrestamo(montoPrestamo, tasaEfectivaMensual, totalPagos);
      console.log("La cuota del préstamo es: ", cuota);
    } catch (error) {
      console.error(error);
    }
  }


  calcularCuotaPrestamo_v1(monto: number, tasaInteresAnual: number, totalPagos: number): any[] {
    const tasaInteresMensual = tasaInteresAnual / 12 / 100;
    const cuota = monto * (tasaInteresMensual / (1 - Math.pow(1 + tasaInteresMensual, -totalPagos)));
    let saldo = monto;
    this.amortizacion = [];
    this.totalInteres = 0;
    this.totalCapital = 0;
    this.interesCuota = 0;
    this.nroCuotas = cuota; 
    for (let i = 1; i <= totalPagos; i++) {
      const interesPagado = saldo * tasaInteresMensual;
      const capitalPagado = cuota - interesPagado;
      saldo -= capitalPagado;
      this.interesCuota += interesPagado;
      this.totalCapital += cuota;
      this.amortizacion.push({
        numeroPago: i,
        cuota: cuota,
        interesPagado: interesPagado,
        capitalPagado: capitalPagado,
        saldoPendiente: saldo > 0 ? saldo : 0,
      });
    }
    console.log(this.amortizacion);
    return this.amortizacion;
  }

  searchCustomer(event) {
    this.customerList = [];
    if (event.term.length === 0) {
      return;
    }
    this.apiCustomer.searchCustomer(event.term, 1).subscribe((res: any) => {
      this.customerList = res.payload.data;
    });
  }
  onCustomerChange(event) {
    console.log(event);
    const selectedCustomer = this.customerList.find(element => element.id === event);

    if (selectedCustomer) {
      this.customerName = selectedCustomer.name;
      this.address = selectedCustomer.address; // Corregí "addrees" a "address"
      this.state = selectedCustomer.typeState;
      this.mountTotal = selectedCustomer.total;
    }
    this.customerId = event;

  }
}
