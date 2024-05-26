import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

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
    return this.http.get(`${this.baseUrl}/menu/list`, {
      headers: this.headers,
    });
  }
  getAllMenu(page: number, limit: number, search: string) {
    console.log(search)
    return this.http.get(`${this.baseUrl}/menu/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }

  deleteMenu(id: number) {
    return this.http.delete(`${this.baseUrl}/menu/delete/${id}`, {
      headers: this.headers,
    });
  }
  getMenuById(id: number) {
    return this.http.get(`${this.baseUrl}/menu/one/${id}`, {
      headers: this.headers,
    });
  }

  postMenu(menu: any) {
    return this.http.post(`${this.baseUrl}/menu/create`, menu, {
      headers: this.headers,
    });
  }

  putMenu(menu: any) {
    return this.http.put(`${this.baseUrl}/menu/update`, menu, {
      headers: this.headers,
    });
  }
}
