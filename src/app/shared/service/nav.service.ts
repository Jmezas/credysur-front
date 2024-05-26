import {Injectable, HostListener, Inject} from '@angular/core';
import {BehaviorSubject, Observable, Subscriber} from 'rxjs';
import {WINDOW} from './windows.service';

// Menu
export interface Menu {
    path?: string;
    title?: string;
    icon?: string;
    type?: string;
    badgeType?: string;
    badgeValue?: string;
    active?: boolean;
    bookmark?: boolean;
    children?: Menu[];
}

@Injectable({
    providedIn: 'root'
})

export class NavService {

    public screenWidth: any;
    public collapseSidebar: boolean = false;

    constructor(@Inject(WINDOW) private window) {
        this.onResize();
        if (this.screenWidth < 991) {
            this.collapseSidebar = true;
        }
    }

    // Windows width
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.screenWidth = window.innerWidth;
    }

    MENUITEMS: Menu[] = [
        {
            path: '/dashboard/default', title: 'panel', icon: 'home', type: 'link', badgeType: 'primary', active: false
        },

        {
            title: 'Prestamo', icon: 'dollar-sign', type: 'sub', active: false, children: [
                {path: '/loans/list-loan', title: 'Cobranza', type: 'link', icon: 'fa fa-trash'},
                {path: '/loans/create-loan', title: 'Crear prestamo', type: 'link'},
            ]
        },
        {
            title: 'Usuarios', icon: 'users', type: 'sub', active: false, children: [
                {path: '/users/list-user', title: 'Lista de usuarios', type: 'link'},
                {path: '/users/create-user', title: 'Crear usuario', type: 'link'},
            ]
        },

        {
            title: 'Reporte Pago', path: '/reports', icon: 'bar-chart', type: 'link', active: false
        },
        {
            title: 'Configuracion', icon: 'settings', type: 'sub', children: [
                {path: '/settings/customer', title: 'Cliente', type: 'link'},
                {path: '/settings/profile', title: 'Perfil', type: 'link'},
                {path: '/settings/zone', title: 'Zona', type: 'link'},
                {path: '/settings/category', title: 'Rubro', type: 'link'},
                {path: '/menus/list-menu', title: 'Menu', type: 'link'},
            ]
        }
    ];
    // Array
    items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
