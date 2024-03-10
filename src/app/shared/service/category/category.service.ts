import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get } from 'http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
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
    return this.http.get(`${this.baseUrl}/category/list`, {
      headers: this.headers,
    });
  }
  getAllCategory(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/category/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/category/delete/${id}`, {
      headers: this.headers,
    });
  }
  getCategoryById(id: number) {
    return this.http.get(`${this.baseUrl}/category/getone/${id}`, {
      headers: this.headers,
    });
  }

  postCategory(category: any) {
    return this.http.post(`${this.baseUrl}/category/create`, category, {
      headers: this.headers,
    });
  }
  
  putCategory(category: any) {
    return this.http.put(`${this.baseUrl}/category/update`, category, {
      headers: this.headers,
    });
  }

}
