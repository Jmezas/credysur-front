import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/shared/common/constants';
import { DismissReason } from 'src/app/shared/common/dismissReason';
import { Result } from 'src/app/shared/models/result.interface';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  page = 1;
  pageSize = 10;
  searchText: string = "";
  totalRecords: number;
  totalPage: number;
  collectionSize = 0;
  categoryList = [];

  closeResult: string;

  categoryForm: any;
  idCategory: number = 0;
  constants: Constants = new Constants();
  
  constructor(
    private apiCategory: CategoryService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getAllCategory();
    this.createForm();
  }

  createForm() {
    this.categoryForm = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", Validators.required],
      comercialActivity: ["", Validators.required],
    });
  }

  getAllCategory() {
    this.apiCategory.getAllCategory(0, this.pageSize, this.searchText).subscribe((res: Result) => {
      console.log(res);
      this.categoryList = res.payload.data;
      this.collectionSize = res.payload.total;
      this.totalRecords = res.payload.total;
      this.totalPage = res.payload.totalPage;
    });
  }

  loadPage($event) {
    this.apiCategory.getAllCategory(($event - 1), this.pageSize, this.searchText).subscribe((res: Result) => {
      console.log(res);
      this.categoryList = res.payload.data;
      this.collectionSize = res.payload.total;
      this.totalRecords = res.payload.total;
      this.totalPage = res.payload.totalPage;
    });
  }

  openModal(content, id: number) {
    if (id != 0) {
      this.getCategoryById(id);
    } else {
      this.onClear();
    }
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" }).result.then(
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
        this.apiCategory.deleteCategory(id).subscribe((res) => {
          this.getAllCategory();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }

  getCategoryById(id: number) {
    this.apiCategory.getCategoryById(id).subscribe((res: Result) => {
      this.idCategory = id;
      let data = res.payload.data;
      this.categoryForm.patchValue({
        name: data.name,
        description: data.description,
        comercialActivity: data.comercialActivity,
      });
    });
  }
  onClear() {
    this.categoryForm.reset();
  }
  onSave() {
    let data = {
      id: 0,
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description,
      comercialActivity: this.categoryForm.value.comercialActivity,
    }
    if (this.idCategory != 0) {
      data.id = this.idCategory;
      this.apiCategory.putCategory(data).subscribe({
        next: (res) => {
          this.getAllCategory();
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

    this.apiCategory.postCategory(data).subscribe({
      next: (res) => {
        this.getAllCategory();
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
