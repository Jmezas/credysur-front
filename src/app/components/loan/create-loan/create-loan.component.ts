import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
    this.onExampleCalculate();
  }

  onCalculate() {
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
 
}
