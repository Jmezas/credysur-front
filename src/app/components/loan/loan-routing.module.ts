import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router';
import { CreateLoanComponent } from './create-loan/create-loan.component';
import { ListLoanComponent } from './list-loan/list-loan.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create-loan',
        component: CreateLoanComponent,
        data: {
          title: "Crear Prestamo",
          breadcrumb: "Crear Prestamo"
        }
      },
      {
        path: 'list-loan',
        component: ListLoanComponent,
        data: {
          title: "Lista de prestamos",
          breadcrumb: "Lista de prestamos"
        }
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
