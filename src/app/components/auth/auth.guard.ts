import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Result } from 'src/app/shared/models/result.interface';
import { AuthService } from 'src/app/shared/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.auth.isLogged() ? of(true) : this.handleNotLoggedIn();
  }

  private handleNotLoggedIn(): Observable<boolean | UrlTree> {
    return this.auth.refreshToken().pipe(
      map((res: Result) => {
        this.auth.saveToken(res.payload.data.accessToken, res.payload.data.refreshToken);
        return true;
      }),
      catchError(() => of(this.router.createUrlTree(['/auth/login'])))
    );
  }
}
