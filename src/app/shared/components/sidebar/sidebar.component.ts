import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {NavService} from '../../service/nav.service';
import {AuthService} from '../../service/auth.service';
import {MenuTree} from '../../models/Menu.inteface';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

    public menuItems: MenuTree[];
    public url: any;
    public fileurl: any;
    user: any;
    role: any;

    constructor(private router: Router, public navServices: NavService, private authService: AuthService) {

        if (this.authService.getUserInfo()) {
            this.navServices.itemMenu().subscribe(menuItems => {
                console.log(menuItems);
                this.menuItems = menuItems;
                this.router.events.subscribe((event) => {
                    if (event instanceof NavigationEnd) {
                        menuItems.filter(items => {
                            if (items.path === event.url) {
                                this.setNavActive(items);
                            }
                            if (!items.children) {
                                return false;
                            }
                            items.children.filter(subItems => {
                                if (subItems.path === event.url) {
                                    this.setNavActive(subItems);
                                }
                                if (!subItems.children) {
                                    return false;
                                }
                                subItems.children.filter(subSubItems => {
                                    if (subSubItems.path === event.url) {
                                        this.setNavActive(subSubItems);
                                    }
                                });
                            });
                        });
                    }
                });
            });
        }
        this.user = this.authService.getUserInfo();
        let roles = JSON.parse(this.user.Role);
        this.role = roles.map((item) => item.roleName).join(', ');
    }

    // Active Nave state
    setNavActive(item) {
        this.menuItems.filter(menuItem => {
            if (menuItem != item) {
                menuItem.active = false;
            }
            if (menuItem.children && menuItem.children.includes(item)) {
                menuItem.active = true;
            }
            if (menuItem.children) {
                menuItem.children.filter(submenuItems => {
                    if (submenuItems.children && submenuItems.children.includes(item)) {
                        menuItem.active = true;
                        submenuItems.active = true;
                    }
                });
            }
        });
    }

    // Click Toggle menu
    toggletNavActive(item) {
        if (!item.active) {
            this.menuItems.forEach(a => {
                if (this.menuItems.includes(item)) {
                    a.active = false;
                }
                if (!a.children) {
                    return false;
                }
                a.children.forEach(b => {
                    if (a.children.includes(item)) {
                        b.active = false;
                    }
                });
            });
        }
        item.active = !item.active;
    }

    //Fileupload
    readUrl(event: any) {
        if (event.target.files.length === 0) {
            return;
        }
        //Image upload validation
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        // Image upload
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.url = reader.result;
        };
    }
}
