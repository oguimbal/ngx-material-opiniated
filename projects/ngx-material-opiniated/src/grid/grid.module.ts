import { GridComponent, GridOpenColumnDirective, GridColumnDirective } from './grid';
import { GridRowComponent } from './grid-row';
import { GridCellComponent } from './grid-cell';
import { ActionBinderComponent } from './action-binder';
import { GridOpenRowComponent } from './grid-open';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OpiniatedInputsModule } from '../inputs/inputs.module';
import { OpiniatedDisplayModule } from '../display/display.module';
import {ContextMenuModule} from '@oguimbal/ngx-contextmenu';
import { OpiniatedLoaderModule } from '../loader/index';
import { OpiniatedCommonModule } from '../common/index';

const GridComponents = [
    GridRowComponent
    , GridCellComponent
    , ActionBinderComponent
    , GridOpenRowComponent
];

const GridExported = [
    GridComponent
    , GridColumnDirective
    , GridOpenColumnDirective
];





@NgModule({
    declarations: [...GridComponents, ...GridExported],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FontAwesomeModule,
        OpiniatedInputsModule,
        OpiniatedDisplayModule,
        ContextMenuModule,
        OpiniatedLoaderModule,
        MatPaginatorModule,
        OpiniatedCommonModule.forChild()
    ],
    entryComponents: [
        ActionBinderComponent
    ],
    exports: [...GridExported]
})
export class OpiniatedGridModule {
}
