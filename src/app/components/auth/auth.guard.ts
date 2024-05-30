import {inject, Injectable} from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
    CanLoad,
    Route,
    UrlSegment,
    CanActivateFn
} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Result} from 'src/app/shared/models/result.interface';
import {AuthService} from 'src/app/shared/service/auth.service';

export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree => {

    return inject(AuthService).isLogged() ? of(true) : handleNotLoggedIn(inject(AuthService),inject(Router));
};


function handleNotLoggedIn(AuthService: any,router: Router): UrlTree {
    if (!AuthService.isLogged()) {
        console.log('Not logged in');
        return router.createUrlTree(['/auth/login']);
    } else {
        console.log('logeado ')
        return AuthService.refreshToken().pipe(
            map((res: Result) => {
                this.auth.saveToken(res.payload.data.accessToken, res.payload.data.refreshToken);
                return true;
            }),
            catchError(() => of(router.createUrlTree(['/auth/login'])))
        );
    }
}