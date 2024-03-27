import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { doughnutData, pieData } from '../../shared/data/chart';
import { LoanService } from 'src/app/shared/service/loans/loan.service';
import { Result } from 'src/app/shared/models/result.interface';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  PendingPayment: number = 0
  ProgrammedPayment: number = 0
  Pay: number = 0
  discount = 0;

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;

  // Datos del gráfico semanal
  barChartDatasetsWeek: ChartDataset[] = [];
  barChartLabelsWeek: string[] = [];
  weekGraphFirst: string;
  weekGraphEnd: string;

  // Datos del gráfico mensual
  barChartDatasetsMonth: ChartDataset[] = [];
  barChartLabelsMonth: string[] = [];
  yearGraph: string;

  constructor(private loanService: LoanService, private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.getPayReport();
    this.getWeekGraph();
    this.getMonthGraph();
  }

  getPayReport() {
    this.loanService.getPayMainStatus().subscribe((rest: Result) => {
      console.log(rest)
      this.PendingPayment = rest.payload.data.pendingPayment
      this.ProgrammedPayment = rest.payload.data.programmedPayment
      this.Pay = rest.payload.data.pay
      this.discount = rest.payload.data.discountTotal
    })
  }

  getWeekGraph() {
    this.loanService.getWeekGraph().subscribe((rest: Result) => {
      this.weekGraphFirst = rest.payload.data[0].date  
      this.weekGraphEnd = rest.payload.data[rest.payload.data.length - 1].date 
      const newDatasets = [
        {
          data: rest.payload.data.map(element => element.totalPaid),
          label: 'Pagos',
          backgroundColor: '#163ead',
          hoverBackgroundColor: '#86F343'

        }
      ];

      // Actualiza las etiquetas del gráfico
      this.barChartLabelsWeek = rest.payload.data.map(element => element.dayWeek);

      // Actualiza los datasets del gráfico
      this.barChartDatasetsWeek = newDatasets;

      this.cdr.detectChanges();
      console.log(this.barChartDatasetsWeek)
      console.log(this.barChartLabelsWeek)
    })
  }


  getMonthGraph() {
    this.loanService.getMontGraph().subscribe((rest: Result) => {
      this.yearGraph = rest.payload.data[0].year
      const newDatasets = [
        {
          data: rest.payload.data.map(element => element.totalPaid),
          label: 'Pagos',
          backgroundColor: '#163ead',
          hoverBackgroundColor: '#86F343'

        }
      ];

      // Actualiza las etiquetas del gráfico
      this.barChartLabelsMonth = rest.payload.data.map(element => element.monthYear);

      // Actualiza los datasets del gráfico
      this.barChartDatasetsMonth = newDatasets;

      this.cdr.detectChanges();
      console.log(this.barChartDatasetsMonth)
      console.log(this.barChartLabelsMonth)
    })
  }
}
