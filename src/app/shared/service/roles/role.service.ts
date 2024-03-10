import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

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
    return this.http.get(`${this.baseUrl}/roles/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }
  getRole() {
    return this.http.get(`${this.baseUrl}/Role/List`, {
      headers: this.headers,
    });
  }

  getRoleById(id: number) {
    return this.http.get(`${this.baseUrl}/roles/${id}`, {
      headers: this.headers,
    });
  }

  postRole(role: any) {
    return this.http.post(`${this.baseUrl}/roles`, role, {
      headers: this.headers,
    });
  }

  putRole(id: number, role: any) {
    return this.http.put(`${this.baseUrl}/roles/${id}`, role, {
      headers: this.headers,
    });
  }

  deleteRole(id: number) {
    return this.http.delete(`${this.baseUrl}/roles/${id}`, {
      headers: this.headers,
    });
  }
}
