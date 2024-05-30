import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { NgbDate, NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Constants } from 'src/app/shared/common/constants';
import { FormUtils } from 'src/app/shared/common/validateForm'; 
import { Result } from 'src/app/shared/models/result.interface';
import { DropdownListUbigeo, RequestUbigeo } from 'src/app/shared/models/ubigeo.interface';
import { RequestUsuario } from 'src/app/shared/models/user.interface';
import { CustomDatepickerI18nService, I18n } from 'src/app/shared/service/CustomDatepickerI18n.service';
import { GeneralService } from 'src/app/shared/service/General/general.service';
import { CustomerService } from 'src/app/shared/service/customers/customer.service';
import { RoleService } from 'src/app/shared/service/roles/role.service';
import { UbigeoService } from 'src/app/shared/service/ubigeo/ubigeo.service';
import { UserService } from 'src/app/shared/service/users/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18nService }]

})
export class CreateUserComponent implements OnInit {
  accountForm: UntypedFormGroup;
  active = 1;
  listTypeDocument: any[] = [];
  roles: any[] = [];
  model: NgbDateStruct;
  departament: DropdownListUbigeo[] = [];
  province: DropdownListUbigeo[] = [];
  district: DropdownListUbigeo[] = [];
  departamentFilter: string;
  DELIMITER: string = "-";
  constants: Constants = new Constants();
  id: number = 0;
  departmentOne: string;
  provinceOne: string;
  showPassword: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder
    , private generalService: GeneralService
    , private toastr: ToastrService
    , private apiCustumer: CustomerService
    , private apiRole: RoleService
    , private apiUbigeo: UbigeoService
    , private apiUser: UserService
    , private activatedRoute: ActivatedRoute
    , private router: Router) { }
  //get form


  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      numberDocument: ['', Validators.required],
      name: ['', Validators.required],
      firstLastname: ['', Validators.required],
      secondLastname: ['', Validators.required],
      dateBirth: ['', Validators.required],
      phone: [''],
      email: ['', Validators.required],
      roles: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required],
      ubigeo: ['', Validators.required],
      adress: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.createAccountForm();
    this.getRoles();
    this.getDepartament();

    // this.getUser();
    this.activatedRoute.params.subscribe((params) => {
      this.id = params["id"];
    });
    if (this.id) {
      this.getUser(this.id);
    }
  }
  getDropdownList(id) {
    this.generalService.dropdownList(id).subscribe((data: any) => {
      console.log(data);
      this.listTypeDocument = data;
    });
  }

  searchDocument(value) {
    if (value.length != 8) {
      this.toastr.warning("El DNI debe tener 8 digitos", "¡Avertencia!");
      return;
    }
    this.apiCustumer.searchDocument(value).subscribe((res: Result) => {
      console.log(res);
      if (res.payload.data.nombre == null || res.payload.data == null) {
        this.toastr.error(res.payload.data.respuesta, "¡Error!");
        return;
      }
      this.accountForm.patchValue({
        name: res.payload.data.nombres,
        firstLastname: res.payload.data.apellidoPaterno,
        secondLastname: res.payload.data.apellidoMaterno,
      });
    });
  }
  getRoles() {
    this.apiRole.getRole().subscribe((res: Result) => {
      this.roles = res.payload.data;
      console.log(this.roles);

    });
  }

  //listar de departamento
  getDepartament() {
    let dataUbigeo: RequestUbigeo = {
      action: "DEPARTAMENTO",
      department: "00",
      province: "00",
    }
    this.apiUbigeo.getUbigeo(dataUbigeo).subscribe((res: Result) => {
      this.departament = res.payload.data;
    });
  }
  onChangeDepartament(event) {
    this.departamentFilter = event;
    let dataUbigeo: RequestUbigeo = {
      action: "PROVINCIA",
      department: event,
      province: "00",
    }
    this.apiUbigeo.getUbigeo(dataUbigeo).subscribe((res: Result) => {
      this.province = res.payload.data; 
    });
  }
  onChangeProvince(event) {
    this.accountForm.patchValue({
      ubigeo: null,
    });
    let dataUbigeo: RequestUbigeo = {
      action: "DISTRITO",
      department: this.departamentFilter,
      province: event,
    }
    this.apiUbigeo.getUbigeo(dataUbigeo).subscribe((res: Result) => {
      this.district = res.payload.data;
    });
  }

  onSave() {
    console.log("this.accountForm.value");
    console.log(this.accountForm.value);
    if (this.accountForm.invalid) {
      FormUtils.markRequiredAsTouched(this.accountForm);
      return;
    }
    let data: RequestUsuario = {
      id: 0,
      name: this.accountForm.value.name,
      firstLastname: this.accountForm.value.firstLastname,
      secondLastname: this.accountForm.value.secondLastname,
      user: this.accountForm.value.user,
      password: this.accountForm.value.password,
      typeDocument: "1",
      numberDocument: this.accountForm.value.numberDocument,
      country: "01",
      ubigeo: this.accountForm.value.ubigeo,
      address: this.accountForm.value.adress,
      birthDate: this.accountForm.value.dateBirth.year + this.DELIMITER + this.accountForm.value.dateBirth.month + this.DELIMITER + this.accountForm.value.dateBirth.day,
      phone: this.accountForm.value.phone,
      email: this.accountForm.value.email,
      roleIds: this.accountForm.value.roles,
    }

    if (this.id) {
      data.id = this.id;
      this.apiUser.putUser(data).subscribe({
        next: (res: Result) => {
          this.toastr.success(this.constants.MESSAGE_SUCCESS_UPDATE, this.constants.TITLE_SUCCESS);

        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.message, "¡Error!");
        },
      })
      return;
    }
    this.apiUser.postUser(data).subscribe({
      next: (res: Result) => {
        this.toastr.success(this.constants.MESSAGE_SUCCESS, this.constants.TITLE_SUCCESS);
        this.router.navigate(["/users/list-user"])
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message, "¡Error!");
      },
    })
  }

  getUser(id: number) {
    this.apiUser.getUserById(id).subscribe((res: Result) => {
      let data = res.payload.data;
      console.log(data);
      this.departmentOne = data.ubigeo.department
      this.onChangeDepartament(data.ubigeo.department);
      this.provinceOne = data.ubigeo.province;
      this.onChangeProvince(data.ubigeo.province);
      this.accountForm.patchValue({
        numberDocument: data.numberDocument,
        name: data.name,
        firstLastname: data.firstLastname,
        secondLastname: data.secondLastname,
        dateBirth: new NgbDate(this.currentDate(data.birthDate).year, this.currentDate(data.birthDate).month, this.currentDate(data.birthDate).day),
        phone: data.phone,
        email: data.email,
        roles: data.usersRoles.map((x) => x.roleId),
        user: data.user,
        password: data.password,
        ubigeo: data.ubigeoId.toString(),
        adress: data.address,
      }); 
    });
  }
  private currentDate(date: any) {
    var todayDate = new Date(date); 
    return {
      year: todayDate.getFullYear(),
      month: todayDate.getMonth() + 1,
      day: todayDate.getDate()
    }
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
