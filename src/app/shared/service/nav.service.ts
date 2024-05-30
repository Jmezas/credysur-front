import {Injectable, HostListener, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WINDOW} from './windows.service';
import {MenuTree} from '../models/Menu.inteface';
import {RoleService} from './roles/role.service';
import {Result} from '../models/result.interface';

@Injectable({
    providedIn: 'root'
})

export class NavService implements OnInit {

    public screenWidth: any;
    public collapseSidebar: boolean = false;
    MENUITEMS: MenuTree[] = [];

    constructor(@Inject(WINDOW) private window, private apiRole: RoleService) {
        this.onResize();
        if (this.screenWidth < 991) {
            console.log('this.screenWidth', this.screenWidth);
            this.collapseSidebar = true;
        }
    }

    ngOnInit() {
        this.apiRole.getListMenuRole().subscribe((resp: Result) => {
            console.log(resp);
            this.MENUITEMS = resp.payload.data;
            console.log(this.MENUITEMS);
        });
    }

    itemMenu(): Observable<MenuTree[]> {
        return new Observable((observer) => {
            this.apiRole.getListMenuRole().subscribe({
                next: (resp: Result) => {
                    this.MENUITEMS = resp.payload.data;
                    observer.next(this.MENUITEMS);
                    observer.complete();
                    console.log(this.MENUITEMS);
                },
                error: (error) => {
                    console.error('Error fetching menu role', error);
                    observer.error(error);
                }
            });
        });
    }

    // Windows width
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        console.log('sidedar', event);
        this.screenWidth = window.innerWidth;
    }

}
