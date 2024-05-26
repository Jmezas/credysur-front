import {Component, OnInit} from '@angular/core';
import {ReportService} from '../../../shared/service/reports/report.service';
import {RoleService} from '../../../shared/service/roles/role.service';
import {Result} from '../../../shared/models/result.interface';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    listRole = [];
    searchText: string = '';
    totalRecords: number;
    totalPage: number;
    collectionSize = 0;
    page = 1;
    pageSize = 5;
    constructor(
        private apiRoles: RoleService
    ) {
    }

    ngOnInit() {
        this.getListRole();
    }

    getListRole() {
        this.apiRoles.getAllRoles(0, 10, this.searchText).subscribe((resp:Result)=> {
            this.listRole = resp.payload.data;
        });
    }

    onDelete() {

    }
    loadPage($event){}
}
