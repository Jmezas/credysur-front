import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  constructor(private spinnerService: NgxSpinnerService) {}

  show() {
    this.spinnerService.show();
  }

  hide() {
    this.spinnerService.hide();
  }
}
