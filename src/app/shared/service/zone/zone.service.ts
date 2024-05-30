import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {AuthService} from '../auth.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HandleError} from '../../common/handleError';

@Injectable({
    providedIn: 'root'
})
export class ZoneService {
    private baseUrl: string;
    headers;

    constructor(private http: HttpClient, private apiAuth: AuthService) {
        this.baseUrl = `${environment.urlAPI}`;
        this.headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
            'Content-type': 'application/json',
        });
    }

    getAll() {
        return this.http.get(`${this.baseUrl}/zone/list`, {
            headers: this.headers,
        }).pipe(catchError(HandleError));
    }

    getAllZone(page: number, limit: number, search: string) {
        return this.http.get(`${this.baseUrl}/zone/fullpage?page=${page}&limit=${limit}&search=${search}`, {
            headers: this.headers,
        }).pipe(catchError(HandleError));
    }

    deleteZone(id: number) {
        return this.http.delete(`${this.baseUrl}/zone/delete/${id}`, {
            headers: this.headers,
        }).pipe(catchError(HandleError));
    }

    getZoneById(id: number) {
        return this.http.get(`${this.baseUrl}/zone/getone/${id}`, {
            headers: this.headers,
        }).pipe(catchError(HandleError));
    }

    postZone(zone: any) {
        return this.http.post(`${this.baseUrl}/zone/create`, zone, {
            headers: this.headers,
        }).pipe(catchError(HandleError));
    }

    putZone(zone: any) {
        return this.http.put(`${this.baseUrl}/zone/update/${zone.id}`, zone, {headers: this.headers})
            .pipe(catchError(HandleError));
    }
}
