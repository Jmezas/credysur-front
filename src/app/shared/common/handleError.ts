import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

export function HandleError(error: HttpErrorResponse) {
    let errorMessage:string = '';
    if (error.error) {
        // Error del lado del cliente o de la red
        errorMessage = `${error.error}`;
    } else {
        // Error del lado del servidor
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(()=> errorMessage);
}