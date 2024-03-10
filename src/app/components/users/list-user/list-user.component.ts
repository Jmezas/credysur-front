import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { Result } from 'src/app/shared/models/result.interface';
import { TableService } from 'src/app/shared/service/table.service';
import { UserService } from 'src/app/shared/service/users/user.service';
import Swal from 'sweetalert2';
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  providers: [TableService, DecimalPipe]
})
export class ListUserComponent implements OnInit {
  user_list = []
  page = 1;
  pageSize = 5;
  searchText: string = "";
  totalRecords: number;
  totalPage: number;
  collectionSize = 0;
  constructor(public service: TableService, private api: UserService,) {
  }
  ngOnInit() {
    this.getAll();
  }
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>; 

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  getAll() {
    this.api.getAllUser(0, this.pageSize, this.searchText).subscribe((res: Result) => {
      this.user_list = res.payload.data;
      this.collectionSize = res.payload.total;
      this.totalRecords = res.payload.total;
      this.totalPage = res.payload.totalPage;
      this.user_list.forEach(user => {
        user.role = user.usersRoles.map(ur => ur.roles.roleName).join(', ');
      });
    });
  }
  loadPage($event){
    this.api.getAllUser(($event - 1), this.pageSize, this.searchText).subscribe((res: Result) => {
      this.user_list = res.payload.data;
      this.collectionSize = res.payload.total;
      this.totalRecords = res.payload.total;
      this.totalPage = res.payload.totalPage;
      this.user_list.forEach(user => {
        user.role = user.usersRoles.map(ur => ur.roles.roleName).join(', ');
      });
    });
  }
 
  formatInput(input: HTMLInputElement) {

    input.value = input.value.replace(FILTER_PAG_REGEX, '');
    console.log(input.value)
  }

  onDelete(id: number) {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ¡borrarlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteUser(id).subscribe((res) => {
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }

}

