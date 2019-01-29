import { Directive, ViewContainerRef, TemplateRef, ComponentFactoryResolver, ComponentRef, ChangeDetectorRef, Input } from '@angular/core';
import { LoaderErrorViewComponent } from './loader.errorview';
import { LoaderLoadingViewComponent } from './loader.loadingview';

// change to use https://codepen.io/IvanKhartov/pen/KmgzpX ?
// => i like the double pulse.

let opCnt = 0;

@Directive({
  selector: '[loader]'
})
export class LoaderDirective {
  cref: ComponentRef<any>;
  private _inline;

  get loaderInline(): boolean {
    return this._inline;
  }

  @Input()
  set loaderInline(v: boolean) {
    this._inline = v;
    if (this.cref) this.cref.instance.inline = true;
  }
  private isWaiting = true;
  private retryFn;
  private currentVal = null;
  private _what;
  private op: Promise<any>;
  private initial = true;

  constructor(
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<any>,
    private cd: ChangeDetectorRef,
    private compFactoryRes: ComponentFactoryResolver
  ) {}

  @Input()
  set loader(newVal: any /* promise, value */) {
    let val = newVal;
    opCnt++;

    if (typeof newVal === 'function') {
      this.retryFn = newVal;
      val = newVal();
    } else this.retryFn = null;

    if (!val) {
      this.create();
      return;
    }

    if (typeof val.toPromise === 'function') 
      val = val.toPromise();

    if (typeof val.then === 'function') {
      this.currentVal = newVal;

      this.waiting();
      val.then(
        () => {
          if (this.currentVal !== newVal) {
            return;
          }
          this.currentVal = null;
          this.create();
        },
        err => {
          if (this.currentVal !== newVal) {
            return;
          }
          this.currentVal = null;
          this.error(err);
        }
      );
      return;
    }

    this.create();
  }

  @Input()
  set loaderWhat(v) {
    this._what = v;
    if (this.cref) this.cref.instance.what = v;
  }

  private create() {
    this.initial = false;
    if (this.op) {
      this.op.then(() => this.create());
      return;
    }
    opCnt++;
    if (!this.isWaiting) {
      return;
    }
    this.isWaiting = false;
    this._viewContainer.clear();
    this._viewContainer.createEmbeddedView(this._templateRef);
    this.cd.detectChanges();
  }

  private error(err) {
    console.error(err);
    if (this.op) {
      this.op.then(() => this.error(err));
      return;
    }
    opCnt++;
    this.isWaiting = false;
    this._viewContainer.clear();
    const factory = this.compFactoryRes.resolveComponentFactory(
      LoaderErrorViewComponent
    );
    const cref = (this.cref = this._viewContainer.createComponent(factory, 0));
    cref.instance.what = this._what;
    cref.instance.inline = this.loaderInline;
    cref.instance.retry = !this.retryFn
      ? null
      : () => (this.loader = this.retryFn);
    if (err && typeof err.find === 'function') err = err.find(x => x);

    if (typeof err !== 'string') {
      this.cd.detectChanges();
      return;
    }
    cref.instance.details = err;
    const lines = err.split(/\r\n|\r|\n/).length;
    cref.instance.showDetails = lines < 3;
    this.cd.detectChanges();
  }

  private waiting() {
    this.isWaiting = true;
    opCnt++;
    // if (this.initial) {
    //   this.doWaiting();
    //   return;
    // }
    const opCpy = opCnt;
    setTimeout(() => {
      if (opCpy !== opCnt) return;
      this.doWaiting();
    }, 500);
  }
  private doWaiting() {
    this.initial = false;
    this._viewContainer.clear();

    const factory = this.compFactoryRes.resolveComponentFactory(
      LoaderLoadingViewComponent
    );
    const cref = (this.cref = this._viewContainer.createComponent(factory, 0));
    cref.instance.what = this._what;
    cref.instance.inline = this.loaderInline;
  }
}
