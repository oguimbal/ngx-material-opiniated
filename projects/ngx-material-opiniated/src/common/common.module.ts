import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { ContextMenuModule, ContextMenuService, IContextMenuOptions } from 'ngx-contextmenu';

@NgModule({
    declarations: [],
    imports: [
        ContextMenuModule
    ],
    entryComponents: [
    ],
    exports: [ContextMenuModule]
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
