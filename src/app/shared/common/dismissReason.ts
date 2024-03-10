import { ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

export class DismissReason {
  constructor(private reason: any) {
    this.control();
  }
  control() {
    if (this.reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (this.reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${this.reason}`;
    }
  }
}
