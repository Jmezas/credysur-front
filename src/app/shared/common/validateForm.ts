import { FormGroup, FormArray, AbstractControl } from '@angular/forms';

export class FormUtils {
  static markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        FormUtils.markAllAsTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => FormUtils.markAllAsTouched(c as FormGroup));
      } else {
        control.markAsTouched();
      }
    });
  }
  static markRequiredAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        FormUtils.markRequiredAsTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => FormUtils.markRequiredAsTouched(c as FormGroup));
      } else if (control.validator) {
        const validators = control.validator({} as AbstractControl);
        if (validators && validators.required) {
          control.markAsTouched();
        }
      }
    });
  }

}
