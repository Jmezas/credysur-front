import { Component, OnInit, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from "@angular/router"; 
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/result.interface';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: UntypedFormGroup;
  public registerForm: UntypedFormGroup;
  public active = 0;
  public iconStart = "assets/svg/icon-start.svg";
  showPassword: boolean = false;

  public item = signal<any[]>([]);
  constructor(private formBuilder: UntypedFormBuilder,private api: AuthService, private router: Router
    ,  private toastr: ToastrService) {
    const active = JSON.parse(localStorage.getItem("ACTIVE")) ?? { active: false };
    if (active.active) {
      console.log("active")
      this.loginForm = this.formBuilder.group({
        userName: [active.userName, [Validators.required]],
          password: [active.password, Validators.required],
        active: [active.active],
      });
    } else {
      this.createLoginForm();
    }
  }
 addproducto(){
  this.item.update((val)=>{
    val.push({name:"hola"})
    return val
  })
 }
  owlcarousel = [
    {
      title: "CREDYSUR",
      desc: "Credysur es un sistema de préstamos diseñado para evaluar a los solicitantes y calcular los montos de préstamos y la venta de artículos de manera eficiente.",
    },
    {
      title: "CREDYSUR",
      desc: "Credysur es una plataforma de préstamos que agiliza el acceso a créditos y la adquisición de artículos, gracias a un eficaz sistema de evaluación",
    }
  ]
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  createLoginForm() {
    console.log("createLoginForm")
    this.loginForm = this.formBuilder.group({
      userName: ["", [Validators.required]],
      password: ["", Validators.required],
      active: [this.active],
    })
  } 

  ngOnInit() {
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      return Object.values(this.loginForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    
    this.api.login(this.loginForm.value).subscribe({ 
      next: (res: Result) => {
      if (this.loginForm.value.active) {
        localStorage.setItem("ACTIVE", JSON.stringify(this.loginForm.value));
      } else {
        localStorage.removeItem("ACTIVE");
      }
      this.api.saveToken(res.payload.data.accessToken, res.payload.data.refreshToken);
      this.router.navigateByUrl("/dashboard/default");
    },
      error: (err) => {
        console.log(err);
        this.toastr.warning(err.error.message, "Advertencia");
      }
    })
  }

}
