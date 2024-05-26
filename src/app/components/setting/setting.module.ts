import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import {SettingRoutingModule} from './setting-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '../../shared/shared.module';
import {ZoneComponent} from './zone/zone.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgSelectModule} from '@ng-select/ng-select';
import {CategoryComponent} from './category/category.component';
import {CustomerComponent} from './customer/customer.component';
import {CreateProfileComponent} from './profile/create-profile/create-profile.component';
import {NzTreeViewModule,} from 'ng-zorro-antd/tree-view';
import {NzIconModule} from 'ng-zorro-antd/icon';

@NgModule({
    declarations: [ProfileComponent, ZoneComponent, CategoryComponent, CustomerComponent, CreateProfileComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        SettingRoutingModule,
        SharedModule,
        NgxSpinnerModule,
        NgSelectModule,
        FormsModule,
        NzTreeViewModule,
        NzIconModule
    ],
    providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class SettingModule {
}
