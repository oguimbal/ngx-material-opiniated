import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { ContextMenuModule, ContextMenuService, IContextMenuOptions } from 'ngx-contextmenu';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faPencilAlt, faTrash, faPlus, faCalendar, faUndo, faSave } from '@fortawesome/free-solid-svg-icons';
import { TemplateInjectorComponent } from './template-injector';
import { FocusDirective } from './focus';
import { OnlyNumberDirective } from './only-number';

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
        FocusDirective,
        OnlyNumberDirective
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
        , OnlyNumberDirective
    ]
})
export class OpiniatedCommonModule {
    static forRoot(): ModuleWithProviders<OpiniatedCommonModule> {
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
    static forChild(): ModuleWithProviders<OpiniatedCommonModule> {
    return { ngModule: OpiniatedCommonModule };
}
}
