import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {MenusRoutingModule} from './menus-routing.module';
import {ListMenuComponent} from './list-menu/list-menu.component';
import {CreateMenuComponent} from './create-menu/create-menu.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from 'src/app/shared/shared.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    declarations: [ListMenuComponent, CreateMenuComponent],
    imports: [
        CommonModule,
        MenusRoutingModule,
        NgbModule,
        SharedModule,
        NgxSpinnerModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule
    ],
    providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class MenusModule {
}
