import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {catchError} from 'rxjs/operators';
import {HandleError} from '../../common/handleError';

@Injectable({
  providedIn: 'root'
})
export class CustomerService { 
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/customers/list`, {
      headers: this.headers,
    }).pipe(catchError(HandleError))
  }
  getAllCustomer(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/customers/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  deleteCustomer(id: number) {
    return this.http.delete(`${this.baseUrl}/customers/delete/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  getCustomerById(id: number) {
    return this.http.get(`${this.baseUrl}/customers/getone/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  postCustomer(customer: any) {
    return this.http.post(`${this.baseUrl}/customers/create`, customer, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  
  putCustomer(customer: any) {
    return this.http.put(`${this.baseUrl}/customers/update`, customer, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  searchDocument(doc: string) {
    return this.http.get(`${this.baseUrl}/customers/GetRucDNI/${doc}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  searchCustomer(docName: string, type: number) : Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/customers/SearchCustomer?search=${docName}&type=${type}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
}
