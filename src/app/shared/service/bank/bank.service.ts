import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {
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
    return this.http.get(`${this.baseUrl}/bank/list`, {
      headers: this.headers,
    });
  }
  getAllBank(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/bank/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }

  deleteBank(id: number) {
    return this.http.delete(`${this.baseUrl}/bank/delete/${id}`, {
      headers: this.headers,
    });
  }
  getBankById(id: number) {
    return this.http.get(`${this.baseUrl}/bank/getone/${id}`, {
      headers: this.headers,
    });
  }

  postBank(category: any) {
    return this.http.post(`${this.baseUrl}/bank/create`, category, {
      headers: this.headers,
    });
  }

  putBank(category: any) {
    return this.http.put(`${this.baseUrl}/bank/update`, category, {
      headers: this.headers,
    });
  }

}
