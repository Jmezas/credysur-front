import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
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
    return this.http.get(`${this.baseUrl}/zone/list`, {
      headers: this.headers,
    });
  }

  getAllZone(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/zone/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }

  deleteZone(id: number) {
    return this.http.delete(`${this.baseUrl}/zone/delete/${id}`, {
      headers: this.headers,
    });
  }
  getZoneById(id: number) {
    return this.http.get(`${this.baseUrl}/zone/getone/${id}`, {
      headers: this.headers,
    });
  }

  postZone(zone: any) {
    return this.http.post(`${this.baseUrl}/zone/create`, zone, {
      headers: this.headers,
    });
  }
  putZone(zone: any) {
    return this.http.put(`${this.baseUrl}/zone/update`, zone, {
      headers: this.headers,
    });
  }
}
