import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private token: string;
    private baseUrl: string;
    private userPermissions: string[] = [];

    menus: any[] = [];

    constructor(private http: HttpClient, private router: Router) {
        this.baseUrl = `${environment.urlAPI}`;
    }

    saveToken(token: string, refreshToken?: string) {
        localStorage.setItem('ACCESS_TOKEN', token);
        if (refreshToken) {
            localStorage.setItem('REFRESH_TOKEN', refreshToken);
        }

        this.token = token;
    }

    public getToken() {
        if (!this.token) {
            return localStorage.getItem('ACCESS_TOKEN');
        }
        return this.token;
    }

    logOut() {
        this.token = '';
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        localStorage.removeItem('MENU');
        this.userPermissions = [];
        this.router.navigateByUrl('/auth/login');
    }

    getUserInfo() {
        const token = this.getToken();
        let payload;
        if (token) {
            payload = this.getPayloadFromToken(token);
            this.setUserPermissions(payload);
            return payload;
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

    refreshToken() {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        return this.http.get(`${this.baseUrl}/auth/refreshtoken/${refreshToken}`);
    }

    getByEmail(email) {
        return this.http.get(`${this.baseUrl}/auth/getEmail/${email}`);
    }

    private getPayloadFromToken(token: string): any | null {
        const payloadEncoded = token.split('.')[1];
        return payloadEncoded ? JSON.parse(atob(payloadEncoded)) : null;
    }

    private setUserPermissions(payload: string): void {
       let listActions = null;
        if (payload && payload['Actions']) {
            try {
                listActions = JSON.parse(payload['Actions']);
            } catch (e) {
                console.error("Error parsing JSON: ", e);
            }
        }

        console.log(listActions);
        if (listActions) {
            if (this.userPermissions.length === 0) {
                this.userPermissions = listActions;
            }
        } else {
            return;
        }


    }

    hasPermission(permission: string): boolean {
        console.log('this.userPermissions', this.userPermissions);
        return this.userPermissions.includes(permission);
    }

}
