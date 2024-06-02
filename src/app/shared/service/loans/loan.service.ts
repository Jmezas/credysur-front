import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Calculate, LoanRequest} from './models/loan';
import {Observable} from 'rxjs';
import {Result} from '../../models/result.interface';
import {catchError} from 'rxjs/operators';
import {HandleError} from '../../common/handleError';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }

  getDailyReport(data: any) {
    return this.http.post(`${this.baseUrl}/loan/dailyreport`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  getLoanReport(data: any) {
    return this.http.post(`${this.baseUrl}/loan/listpay`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  getListDetail(id: number) {
    return this.http.get(`${this.baseUrl}/loan/listReportDetail/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  getListDetailPay(id: number, number: number) {
    return this.http.get(`${this.baseUrl}/loan/ListReportDetailPay/${id}/${number}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  payment(data: any) {
    return this.http.post(`${this.baseUrl}/loan/Payment`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  paymentAmortization(data: any) {
    return this.http.post(`${this.baseUrl}/loan/PaymentAmortization`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  deleteDetailPay(data: any) {
    return this.http.post(`${this.baseUrl}/loan/DeletePayment`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/loan/DeleteLoan?id=${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  getserie() {
    return this.http.get(`${this.baseUrl}/loan/GetList`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  getPayMainStatus() {
    return this.http.get(`${this.baseUrl}/loan/GetPayMainStatus`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  getWeekGraph() {
    return this.http.get(`${this.baseUrl}/loan/GetWeekGraph`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  getMontGraph() {
    return this.http.get(`${this.baseUrl}/loan/GetMonthGraph`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  calculcateLoanPay(data: Calculate) {
    console.log(this.headers)
    return this.http.post(`${this.baseUrl}/loan/CalculateLoan`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  calculcateLoanPay_v2(data: Calculate) {
    console.log(this.headers)
    return this.http.post(`${this.baseUrl}/loan/CalculateLoan_v2`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  insertLoan(data: LoanRequest):Observable<Result> {
    console.log(this.headers)
    return this.http.post<Result>(`${this.baseUrl}/loan/InserLoan`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  paymentGeneral(data: any) {
    return this.http.post(`${this.baseUrl}/loan/PaymentGeneral`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  getListDetailPayGeneral(id:number) {
    return this.http.get(`${this.baseUrl}/loan/ListReportDetailPayGeneral/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  deleteDetailPayGeneral(data: any) {
    return this.http.post(`${this.baseUrl}/loan/DeletePaymentGeneral`, data, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
}
