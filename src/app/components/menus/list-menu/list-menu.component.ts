
import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Constants} from '../../../shared/common/constants';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Result} from '../../../shared/models/result.interface';
import {DismissReason} from '../../../shared/common/dismissReason';
import Swal from 'sweetalert2';
import {MenuService} from '../../../shared/service/menu/menu.service';
import {Droplist, DroplistRes, TYPELINK} from '../../../shared/models/droplist';
import {MenuResquest} from '../../../shared/models/Menu.inteface';

@Component({
    selector: 'app-list-menu',
    templateUrl: './list-menu.component.html',
    styleUrls: ['./list-menu.component.scss'],
})
export class ListMenuComponent implements OnInit {
    page = 1;
    pageSize = 10;
    searchText: string = '';
    totalRecords: number;
    totalPage: number;
    collectionSize = 0;
    menuList = [];

    closeResult: string;

    menuForm: any;
    idMenu: number = 0;
    constants: Constants = new Constants();
    listMenu: DroplistRes[] = [];
    listTypeLink = TYPELINK;

    constructor(
        private apiMenu: MenuService,
        private modalService: NgbModal,
        private fb: UntypedFormBuilder,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        this.getAllMenu();
        this.createForm();
        this.getListMenu();
    }

    createForm() {
        this.menuForm = this.fb.group({
            parentId: [null],
            description: ['', [Validators.required]],
            orderby: ['', Validators.required],
            type: ['', [Validators.required]],
            path: [null],
            icon: [null],
        });
    }

    getAllMenu() {
        this.apiMenu.getAllMenu(0, this.pageSize, this.searchText).subscribe((res: Result) => {
            console.log(res);
            this.menuList = res.payload.data;
            this.collectionSize = res.payload.total;
            this.totalRecords = res.payload.total;
            this.totalPage = res.payload.totalPage;
        });
    }

    loadPage($event) {
        this.apiMenu.getAllMenu(($event - 1), this.pageSize, this.searchText).subscribe((res: Result) => {
            console.log(res);
            this.menuList = res.payload.data;
            this.collectionSize = res.payload.total;
            this.totalRecords = res.payload.total;
            this.totalPage = res.payload.totalPage;
        });
    }

    getListMenu() {
        this.apiMenu.getAll().subscribe((res: Result) => {
            this.listMenu = res.payload.data.filter(x=> x.type==='sub');
        });
    }

    openModal(content, id: number) {
        if (id != 0) {
            this.getMenuById(id);
        } else {
            this.onClear();
        }
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${new DismissReason(reason)}`;
            }
        );
    }

    onDelete(id: number) {
        Swal.fire({
            title: '¿Estas seguro?',
            text: 'No podras revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, ¡borrarlo!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiMenu.deleteMenu(id).subscribe((res) => {
                    this.getAllMenu();
                    Swal.fire('Borrado!', 'Tu registro ha sido borrado.', 'success');
                });
            }
        });
    }

    getMenuById(id: number) {
        this.apiMenu.getMenuById(id).subscribe((res: Result) => {
            this.idMenu = id;
            let data = res.payload.data;
            this.menuForm.patchValue({
                parentId: data.parentId,
                description: data.description,
                orderby: data.orderby,
                type: data.type,
                path: data.path,
                icon: data.icon,
            });
        });
    }

    onClear() {
        this.menuForm.reset();
    }

    onSave() {
        let data: MenuResquest = this.menuForm.value;
        console.log(data);
        if (this.idMenu != 0) {
            data.id = this.idMenu;
            this.apiMenu.putMenu(data).subscribe({
                next: (res) => {
                    this.getAllMenu();
                    this.onClear();
                    this.modalService.dismissAll();
                    this.toastr.success(this.constants.MESSAGE_SUCCESS_UPDATE, this.constants.TITLE_SUCCESS);
                },
                error: (err) => {
                    this.toastr.error(err.error.message, this.constants.TITLE_ERROR);
                },
            });
            return;
        }

        this.apiMenu.postMenu(data).subscribe({
            next: (res) => {
                this.getAllMenu();
                this.onClear();
                this.modalService.dismissAll();
                this.toastr.success(this.constants.MESSAGE_SUCCESS, this.constants.TITLE_SUCCESS);
            },
            error: (err) => {
                this.toastr.error(err.error.message, this.constants.TITLE_ERROR);
            },
        });
    }

}
