import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private baseUrl: string;
    headers;

    constructor(private http: HttpClient) {
        this.baseUrl = `${environment.urlAPI}`;
        this.headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
            'Content-type': 'application/json',
        });
    }

    postReportExcel(data: any) {
        return this.http.post(`${this.baseUrl}/report/ReportLoanExcel`, data, {
            headers: this.headers,
            responseType: 'blob'
        });
    }

    getReportLoanPDF(id: number, idPdf: number) {
        return this.http.get(`${this.baseUrl}/report/ReportLoanPDF/${id}/${idPdf}`, {
            headers: this.headers,
            responseType: 'blob'
        });
    }


    getReportSchedulePDFId(id: number) {
        return this.http.get(`${this.baseUrl}/report/ReportSchedulePDF/${id}`, {
            headers: this.headers,
            responseType: 'blob'
        });
    }

    getReportCommitmentPDFId(id: number) {
        return this.http.get(`${this.baseUrl}/report/ReportCommitmentPDF/${id}`, {
            headers: this.headers,
            responseType: 'blob'
        });
    }

    postReportDayExcel(data: any) {
        return this.http.post(`${this.baseUrl}/report/ReportLoanExcel`, data, {
            headers: this.headers,
            responseType: 'blob'
        });
    }

    getReportPayLoanPDF(id: number, numberPay: number, pay: number, send: boolean) {
        return this.http.get(`${this.baseUrl}/report/ReportPayLoanPDF/${id}/${numberPay}/${pay}/${send}`, {
            headers: this.headers,
            responseType: 'blob'
        });
    }
}
