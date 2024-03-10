import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestUbigeo } from '../../models/ubigeo.interface';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getUbigeo(data: RequestUbigeo) {
    return this.http.post(`${this.baseUrl}/ubigeo/GetListQuery`,data, { headers: this.headers });
  }
}
