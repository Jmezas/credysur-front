import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

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
    });
  }

  getUser() {
    return this.http.get(`${this.baseUrl}/user/listUsers`, {
      headers: this.headers,
    });
  }

  getUserById(id: number) {
    return this.http.get(`${this.baseUrl}/user/getone/${id}`, {
      headers: this.headers,
    });
  }

  postUser(user: any) {
    return this.http.post(`${this.baseUrl}/user/create`, user, {
      headers: this.headers,
    });
  }

  putUser(user: any) {
    return this.http.put(`${this.baseUrl}/user/update`, user, {
      headers: this.headers,
    });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/user/delete/${id}`, {
      headers: this.headers,
    });
  }
  updatePassword(userPass: any) {
    return this.http.post(`${this.baseUrl}/user/update-password`, userPass, {
      headers: this.headers,
    });
  }
}
