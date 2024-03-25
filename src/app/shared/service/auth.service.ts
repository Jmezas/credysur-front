import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  private baseUrl: string;
  menus: any[] = [];
  constructor(private http: HttpClient, private router: Router) {
    this.baseUrl = `${environment.urlAPI}`;
  }

  saveToken(token: string, refreshToken?: string) {
    localStorage.setItem("ACCESS_TOKEN", token);
    if (refreshToken) {
      localStorage.setItem("REFRESH_TOKEN", refreshToken);
    }

    this.token = token;
  }

  public getToken() {
    if (!this.token) {
      return localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }

  logOut() {
    this.token = "";
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    localStorage.removeItem("MENU");
    this.router.navigateByUrl("/auth/login");
  }

  getUserInfo() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      return JSON.parse(window.atob(payload));
    } else {
      return null;
    }
  }

  isLogged() {
    const user = this.getUserInfo();

    return user ? user.exp > Date.now() / 1000 : false;
  }

  login(user) {
    return this.http.post(`${this.baseUrl}/auth/login`, user);
  }

  returnToken() {
    return this.isLogged ? this.getToken() : null;
  }

  menuRole(role) {
    let headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
    return this.http.get(`${this.baseUrl}/menu/treeRole/${role}`, { headers: headers });
  }

  refreshToken() {
    const refreshToken = localStorage.getItem("REFRESH_TOKEN");
    return this.http.get(`${this.baseUrl}/auth/refreshtoken/${refreshToken}`);
  }
  
  getByEmail(email) {
    return this.http.get(`${this.baseUrl}/auth/getEmail/${email}`);
  }
}
