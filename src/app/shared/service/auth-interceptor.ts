import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {AuthService} from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authAPI: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
        return this.handleRequest(req, next);
    }

    private handleRequest(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.authAPI.getToken();

        if (token != null) {
            authReq = this.addTokenHeader(req, token);
        }

        return next.handle(authReq).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(authReq, next);
                }

                return throwError(error);
            })
        );
    }

    private handle401Error(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return this.authAPI.refreshToken().pipe(
            switchMap((newToken: string) => {
                const authReq = this.addTokenHeader(req, newToken);
                return next.handle(authReq);
            }),
            catchError((error) => {
                // Handle refresh token failure or other errors here
                // For example, log out the user
                this.authAPI.logOut();
                return throwError(error);
            })
        );
    }

    private addTokenHeader(
        req: HttpRequest<any>,
        token: string
    ): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
