import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Constants} from 'src/app/shared/common/constants';
import {DismissReason} from 'src/app/shared/common/dismissReason';
import {Result} from 'src/app/shared/models/result.interface';
import {DropdownListUbigeo, RequestUbigeo} from 'src/app/shared/models/ubigeo.interface';
import {UbigeoService} from 'src/app/shared/service/ubigeo/ubigeo.service';
import {ZoneService} from 'src/app/shared/service/zone/zone.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-zone',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {
    page = 1;
    pageSize = 5;
    searchText: string = '';
    totalRecords: number;
    totalPage: number;
    collectionSize = 0;
    zoneList = [];

    closeResult: string;
    zoneForm: any;

    departament: DropdownListUbigeo[] = [];
    province: DropdownListUbigeo[] = [];
    district: DropdownListUbigeo[] = [];
    departamentFilter: string;

    departmentOne: string;
    provinceOne: string;
    idZone: number;

    constants: Constants = new Constants();

    constructor(
        private apiZone: ZoneService,
        private modalService: NgbModal,
        private fb: UntypedFormBuilder,
        private apiUbigeo: UbigeoService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        this.createForm();
        this.getAllZone();
        this.getDepartament();
    }

    createForm() {
        this.zoneForm = this.fb.group({

            name: ['', [Validators.required]],
            ubigeo: ['', Validators.required],
        });
    }

    getAllZone() {
        this.apiZone.getAllZone(0, this.pageSize, this.searchText).subscribe((res: Result) => {
            console.log(res);
            this.zoneList = res.payload.data;
            this.collectionSize = res.payload.total;
            this.totalRecords = res.payload.total;
            this.totalPage = res.payload.totalPage;
        });
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
                this.apiZone.deleteZone(id).subscribe((res) => {
                    this.getAllZone();
                    Swal.fire('Borrado!', 'Tu registro ha sido borrado.', 'success');
                }, error => {
                    const errorMessage = error || 'Ocurrió un error al actualizar la zona';
                    this.toastr.error(errorMessage, this.constants.TITLE_ERROR);
                });
            }
        });
    }

    loadPage($event) {
        this.apiZone.getAllZone(($event - 1), this.pageSize, this.searchText).subscribe((res: Result) => {
            console.log(res);
            this.zoneList = res.payload.data;
            this.collectionSize = res.payload.total;
            this.totalRecords = res.payload.total;
            this.totalPage = res.payload.totalPage;
        });
    }

    openModal(content, id: number) {
        if (id != 0) {
            this.getZoneById(id);
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

    getDepartament() {
        let dataUbigeo: RequestUbigeo = {
            action: 'DEPARTAMENTO',
            department: '00',
            province: '00',
        };
        this.apiUbigeo.getUbigeo(dataUbigeo).subscribe((res: Result) => {
            this.departament = res.payload.data;
        });
    }

    onChangeDepartament(event) {
        this.departamentFilter = event;
        let dataUbigeo: RequestUbigeo = {
            action: 'PROVINCIA',
            department: event,
            province: '00',
        };
        this.apiUbigeo.getUbigeo(dataUbigeo).subscribe((res: Result) => {
            this.province = res.payload.data;
        });
    }

    onChangeProvince(event) {
        this.district = [];
        this.zoneForm.patchValue({
            ubigeo: null,
        });
        let dataUbigeo: RequestUbigeo = {
            action: 'DISTRITO',
            department: this.departamentFilter,
            province: event,
        };
        this.apiUbigeo.getUbigeo(dataUbigeo).subscribe((res: Result) => {
            this.district = res.payload.data;
        });
    }

    onSave() {
        let data = {
            id: 0,
            name: this.zoneForm.value.name.map((x) => x).join('/'),
            UbigeoId: this.zoneForm.value.ubigeo,
        };
        const request$ = this.idZone !== 0
            ? this.apiZone.putZone(data)
            : this.apiZone.postZone(data);
        request$.subscribe({
            next: () => {
                this.handleSuccess();
            },
            error: (err) => {
                this.handleError(err);
            }
        });
    }

    handleSuccess() {
        this.getAllZone();
        this.modalService.dismissAll();
        const successMessage = this.idZone !== 0
            ? this.constants.MESSAGE_SUCCESS_UPDATE
            : this.constants.MESSAGE_SUCCESS;
        this.toastr.success(successMessage, this.constants.TITLE_SUCCESS);
    }

    handleError(err: any) {
        const errorMessage = err || 'Ocurrió un error al actualizar la zona';
        this.toastr.error(errorMessage, this.constants.TITLE_ERROR);
    }

    getZoneById(id: number) {
        this.apiZone.getZoneById(id).subscribe((res: Result) => {
            let data = res.payload.data;
            //ubigeo
            this.departmentOne = data.ubigeo.department;
            this.onChangeDepartament(data.ubigeo.department);
            this.provinceOne = data.ubigeo.province;
            this.onChangeProvince(data.ubigeo.province);
            this.idZone = data.id;
            this.zoneForm.patchValue({
                name: data.name.split('/'),
                ubigeo: data.ubigeoId.toString(),
            });
        },error => {
            const message = error.message|| "Ocurrió un error en Obtener la zona"
            this.toastr.error(message , this.constants.TITLE_ERROR )
        } );
    }

    onClear() {
        this.zoneForm.reset();
        this.idZone = 0;
        this.provinceOne = null;
        this.departmentOne = null;
        this.province = [];
        this.departamentFilter = null;
        this.district = [];
        this.departament = [];
        this.getDepartament();
    }
}
