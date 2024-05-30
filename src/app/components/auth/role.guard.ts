import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateFn} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../shared/service/auth.service';

export const RoleGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
):
    Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree => {
    const user = inject(AuthService).getUserInfo();
    if (user) {
        let url = JSON.parse(user.Url);
        console.log('url', url);
        if (user && url && url.includes(state.url)) {
            return true;
        } else {
            return inject(Router).createUrlTree(['/access-denied']);
        }
    } else {
        return inject(Router).createUrlTree(['auth/login']);
    }
};