import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get } from 'http';
import { environment } from 'src/environments/environment';
import {catchError} from 'rxjs/operators';
import {HandleError} from '../../common/handleError';

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
    }).pipe(catchError(HandleError));
  }
  getAllCategory(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/category/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/category/delete/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  getCategoryById(id: number) {
    return this.http.get(`${this.baseUrl}/category/getone/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  postCategory(category: any) {
    return this.http.post(`${this.baseUrl}/category/create`, category, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  
  putCategory(category: any) {
    return this.http.put(`${this.baseUrl}/category/update`, category, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

}
