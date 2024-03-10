import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';

import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { NgSelectModule } from '@ng-select/ng-select'; 
import { NgbDateCustomParserFormatter } from 'src/app/shared/common/formateDate';

@NgModule({
  declarations: [ListUserComponent, CreateUserComponent],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    UsersRoutingModule,
    NgxSpinnerModule,
    NgSelectModule
  ],
  providers: [ {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],
  schemas: [NO_ERRORS_SCHEMA],
})
export class UsersModule { }
