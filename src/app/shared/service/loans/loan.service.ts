import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
    });
  }

  getLoanReport(data: any) {
    return this.http.post(`${this.baseUrl}/loan/listpay`, data, {
      headers: this.headers,
    });
  }

  getListDetail(id: number) {
    return this.http.get(`${this.baseUrl}/loan/listReportDetail/${id}`, {
      headers: this.headers,
    });
  }

  getListDetailPay(id: number, number: number) {
    return this.http.get(`${this.baseUrl}/loan/ListReportDetailPay/${id}/${number}`, {
      headers: this.headers,
    });
  }

  payment(data: any) {
    return this.http.post(`${this.baseUrl}/loan/Payment`, data, {
      headers: this.headers,
    });
  }

  paymentAmortization(data: any) {
    return this.http.post(`${this.baseUrl}/loan/PaymentAmortization`, data, {
      headers: this.headers,
    });
  }

  deleteDetailPay(data: any) {
    return this.http.post(`${this.baseUrl}/loan/DeletePayment`, data, {
      headers: this.headers,
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/loan/DeleteLoan?id=${id}`, {
      headers: this.headers,
    });
  }

}
