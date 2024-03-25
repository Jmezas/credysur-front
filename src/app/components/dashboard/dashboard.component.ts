import { Component, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { doughnutData, pieData } from '../../shared/data/chart';
import { LoanService } from 'src/app/shared/service/loans/loan.service';
import { Result } from 'src/app/shared/models/result.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  PendingPayment: number = 0
  ProgrammedPayment: number = 0
  Pay: number = 0
  constructor(private loanService: LoanService) {
  }
  ngOnInit() {
    this.getPayReport();
  }

  getPayReport() {
    this.loanService.getPayMainStatus().subscribe((rest: Result) => {
      console.log(rest)
      this.PendingPayment = rest.payload.data.pendingPayment
      this.ProgrammedPayment = rest.payload.data.programmedPayment
      this.Pay = rest.payload.data.pay
    })
  }
}
