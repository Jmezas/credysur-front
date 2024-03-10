import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DismissReason } from 'src/app/shared/common/dismissReason';
import { Result } from 'src/app/shared/models/result.interface';
import { GeneralService } from 'src/app/shared/service/General/general.service';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { CustomerService } from 'src/app/shared/service/customers/customer.service';
import { UserService } from 'src/app/shared/service/users/user.service';
import { ZoneService } from 'src/app/shared/service/zone/zone.service';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import Swal from 'sweetalert2';
import { Constants } from 'src/app/shared/common/constants';

// Registrar los datos de localización para español
registerLocaleData(localeEs);
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  page = 1;
  pageSize = 10;
  searchText: string = "";
  totalRecords: number;
  totalPage: number;
  collectionSize = 0;
  closeResult: string;

  customerList = [];
  customerForm: any;

  general: [];
  user: [];
  status: [];
  zone: [];
  valueCustomer: [];
  category: [];
  id: number = 0;

  constants: Constants = new Constants();
  constructor(
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private apiCustomer: CustomerService,
    private apiGeneral: GeneralService,
    private apiUser: UserService,
    private apiZone: ZoneService,
    private apiCategory: CategoryService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.getAllCustomer();
    this.getTypeDocument();
    this.getUser();
    this.getStatus();
    this.getZone();
    this.getValueCustomer();
    this.getRubro();
  }

  /**
   * Crear formulario
   */
  createForm() {
    this.customerForm = this.fb.group({
      type: [null, Validators.required],
      numberDocument: ["", Validators.required],
      customerName: ["", Validators.required],
      cellPhone: [""],
      email: [""],
      address: ["", Validators.required],
      collectorId: [null, Validators.required],
      total: ["", Validators.required],
      typeStatus: [null, Validators.required],
      zoneId: [null, Validators.required],
      validateId: [null,],
      category: [null, Validators.required],
      observation: ["", Validators.required],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.customerForm.get(controlName);
    return control && control.invalid && control.touched;
  }

  isFieldInvalid(field: string, error: string): boolean {
    const control = this.customerForm.get(field);
    return control && control.invalid && control.touched && control.hasError(error);
  }

  /**
   * Lista de tipo de documento para el select
   */
  getTypeDocument() {
    this.apiGeneral.dropdownList(1).subscribe((res: any) => {
      this.general = res;
    });
  }

  /**
   * Lista de cliente
   */
  getAllCustomer() {
    this.apiCustomer.getAllCustomer(0, this.pageSize, this.searchText).subscribe((res: Result) => {
      console.log(res);
      this.customerList = res.payload.data;
      this.collectionSize = res.payload.total;
      this.totalRecords = res.payload.total;
      this.totalPage = res.payload.totalPage;
    });
  }

  /**
   * Paginación
   * @param $event 
   */
  loadPage($event) {
    this.apiCustomer.getAllCustomer(($event - 1), this.pageSize, this.searchText).subscribe((res: Result) => {
      console.log(res);
      this.customerList = res.payload.data;
      this.collectionSize = res.payload.total;
      this.totalRecords = res.payload.total;
      this.totalPage = res.payload.totalPage;
    });
  }

  /**
   * Abrir modal
   */
  openModal(content, id: number) {
    if (id != 0) {
      this.getCustomerBy(id);
    } else {
      this.onClear();
    }
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${new DismissReason(reason)}`;
      }
    );
  }

  /**
   * Buscar documento en la api de sunat
   */
  getBucarDocumento() {
    console.log(this.customerForm.value.type);
    if (this.customerForm.value.type != null) {
      if (this.customerForm.value.numberDocument != null) {
        if (this.customerForm.value.type == 2) {
          if (this.customerForm.value.numberDocument.length != 11) {
            this.toastr.warning("El RUC debe tener 11 digitos", "¡Avertencia!");
            return;
          }
          this.apiCustomer.searchDocument(this.customerForm.value.numberDocument).subscribe((res: Result) => {
            if (res.payload.data.TipoRespuesta == 2) {
              this.toastr.error(res.payload.data.MensajeRespuesta, "¡Error!");
              return;
            }
            this.customerForm.controls["customerName"].setValue(res.payload.data.razonSocial.trim());
            this.customerForm.controls["address"].setValue(res.payload.data.domicilioFiscal.replace(/\s+/g, " "));
          });
        } else if (this.customerForm.value.type == 1) {
          if (this.customerForm.value.numberDocument.length != 8) {
            this.toastr.warning("El DNI debe tener 8 digitos", "¡Avertencia!");
            return;
          }
          this.apiCustomer.searchDocument(this.customerForm.value.numberDocument).subscribe((res: Result) => {
            if (res.payload.data.nombre == null || res.payload.data == null) {
              this.toastr.error(res.payload.data.respuesta, "¡Error!");
              return;
            }
            this.customerForm.controls["customerName"].setValue(`${res.payload.data.nombre}`);
          });
        } else {
          this.toastr.warning("Seleccione un tipo de documento", "¡Avertencia!");
          return;
        }
      } else {
        this.toastr.warning("Ingrese nro documento", "¡Avertencia!");
        return;
      }
    } else {
      this.toastr.warning("Seleccione un tipo de documento", "¡Avertencia!");
      return;
    }
  }

  /**
   * Lista de usuario para el select de cobrador
   */
  getUser() {
    this.apiUser.getUser().subscribe((res: Result) => {
      this.user = res.payload.data;
    })
  }

  /**
   * Lista de estado para el select
   */
  getStatus() {
    this.apiGeneral.dropdownList(7).subscribe((res: any) => {
      console.log(res);
      this.status = res;
    });
  }

  /**
   * Lista de zona para el select
   */
  getZone() {
    this.apiZone.getAll().subscribe((res: Result) => {
      this.zone = res.payload.data;
    });
  }

  /**
   * Lista de valor de cliente para el select
   */
  getValueCustomer() {
    this.apiCustomer.getAll().subscribe((res: Result) => {
      this.valueCustomer = res.payload.data;
    });
  }

  /**
   * Lista de rubro para el select
   */
  getRubro() {
    this.apiCategory.getAll().subscribe((res: Result) => {
      this.category = res.payload.data;
    });
  }

  /**
   * obtener cliente por id
   * @param id del cliente
   */
  getCustomerBy(id: number) {
    this.apiCustomer.getCustomerById(id).subscribe((res: Result) => {
      let data = res.payload.data;
      console.log(data);
      this.id = data.id;
      this.customerForm.patchValue({
        type: data.type,
        numberDocument: data.numberDocument,
        customerName: data.customerName,
        cellPhone: data.cellPhone,
        email: data.email,
        address: data.address,
        collectorId: data.collectorID,
        total: data.total,
        typeStatus: data.typeStatus,
        zoneId: data.zoneId,
        validateId: data.validateId,
        category: data.categoryId,
        observation: data.observation,
      });
    });

  }
  onClear() {
    this.customerForm.reset();
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
        this.apiCustomer.deleteCustomer(id).subscribe((res) => {
          this.getAllCustomer();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }

  onSave() {
    let data = {
      id: 0,
      type: this.customerForm.value.type,
      numberDocument: this.customerForm.value.numberDocument,
      customerName: this.customerForm.value.customerName,
      cellPhone: this.customerForm.value.cellPhone,
      email: this.customerForm.value.email,
      address: this.customerForm.value.address,
      collectorId: this.customerForm.value.collectorId,
      total: this.customerForm.value.total,
      typeStatus: this.customerForm.value.typeStatus,
      zoneId: this.customerForm.value.zoneId,
      validateId: this.customerForm.value.validateId,
      categoryId: this.customerForm.value.category,
      observation: this.customerForm.value.observation,
    }

    if (this.id != 0) {
      data.id = this.id;
      this.apiCustomer.putCustomer(data).subscribe({
        next: (res) => {
          this.toastr.success(this.constants.MESSAGE_SUCCESS_UPDATE, this.constants.TITLE_SUCCESS);
          this.getAllCustomer();
          this.modalService.dismissAll();
        },
        error: (err) => {
          this.toastr.error(err.error.message, this.constants.TITLE_ERROR);
        }
      });
      return;
    }

    this.apiCustomer.postCustomer(data).subscribe({
      next: (res) => {
        this.toastr.success(this.constants.MESSAGE_SUCCESS, this.constants.TITLE_SUCCESS);
        this.getAllCustomer();
        this.modalService.dismissAll();
      },
      error: (err) => {
        this.toastr.error(err.error.message, this.constants.TITLE_ERROR);
      }
    });
  }
}
