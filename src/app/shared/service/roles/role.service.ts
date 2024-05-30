import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {catchError} from 'rxjs/operators';
import {HandleError} from '../../common/handleError';

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllRoles(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/Role/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  getRole() {
    return this.http.get(`${this.baseUrl}/Role/List`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  getRoleById(id: number) {
    return this.http.get(`${this.baseUrl}/Role/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  postRole(role: any) {
    console.log(role);
    return this.http.post(`${this.baseUrl}/Role/Create`, role, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  putRole(id: number, role: any) {
    return this.http.put(`${this.baseUrl}/Role/Update/${id}`, role, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  deleteRole(id: number) {
    return this.http.delete(`${this.baseUrl}/Role/create/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  getListMenuActionRole(id:number) {
    return this.http.get(`${this.baseUrl}/Role/ListMenuActionRole/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  getListMenuRole() {
    return this.http.get(`${this.baseUrl}/Role/ListMenuRole`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
}
