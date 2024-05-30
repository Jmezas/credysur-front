import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {catchError} from 'rxjs/operators';
import {HandleError} from '../../common/handleError';

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }

  getAllUser(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/user/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  getUser() {
    return this.http.get(`${this.baseUrl}/user/listUsers`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  getUserById(id: number) {
    return this.http.get(`${this.baseUrl}/user/getone/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  postUser(user: any) {
    return this.http.post(`${this.baseUrl}/user/create`, user, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  putUser(user: any) {
    return this.http.put(`${this.baseUrl}/user/update`, user, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/user/delete/${id}`, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
  updatePassword(userPass: any) {
    return this.http.post(`${this.baseUrl}/user/update-password`, userPass, {
      headers: this.headers,
    }).pipe(catchError(HandleError));
  }
}
