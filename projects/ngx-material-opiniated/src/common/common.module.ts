import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { ContextMenuModule, ContextMenuService, IContextMenuOptions } from 'ngx-contextmenu';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faPencilAlt, faTrash, faPlus, faCalendar, faUndo, faSave } from '@fortawesome/free-solid-svg-icons';
import { TemplateInjectorComponent } from './template-injector';
import { FocusDirective } from './focus';

library.add(
    faCheck,
    faPencilAlt,
    faTrash,
    faPlus,
    faCalendar,
    faUndo,
    faSave
);

@NgModule({
    declarations: [
        TemplateInjectorComponent,
        FocusDirective
    ],
    imports: [
        ContextMenuModule
    ],
    entryComponents: [
    ],
    exports: [
        ContextMenuModule
        , TemplateInjectorComponent
        , FocusDirective
    ]
})
export class OpiniatedCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: OpiniatedCommonModule,
            providers: [
                ContextMenuService,
                {
                    // see https://github.com/isaacplmann/ngx-contextmenu/blob/master/projects/ngx-contextmenu/src/lib/contextMenu.tokens.ts
                    provide: new InjectionToken('CONTEXT_MENU_OPTIONS'),
                    useValue: <IContextMenuOptions> { autoFocus: true, },
                },
            ]
        };
    }
    static forChild() {
        return {ngModule: OpiniatedCommonModule};
    }
}
