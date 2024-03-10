import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
    });
  }
  getAllCustomer(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/customers/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }

  deleteCustomer(id: number) {
    return this.http.delete(`${this.baseUrl}/customers/delete/${id}`, {
      headers: this.headers,
    });
  }
  getCustomerById(id: number) {
    return this.http.get(`${this.baseUrl}/customers/getone/${id}`, {
      headers: this.headers,
    });
  }

  postCustomer(customer: any) {
    return this.http.post(`${this.baseUrl}/customers/create`, customer, {
      headers: this.headers,
    });
  }
  
  putCustomer(customer: any) {
    return this.http.put(`${this.baseUrl}/customers/update`, customer, {
      headers: this.headers,
    });
  }
  searchDocument(doc: string) {
    return this.http.get(`${this.baseUrl}/customers/GetRucDNI/${doc}`, {
      headers: this.headers,
    });
  }

}
