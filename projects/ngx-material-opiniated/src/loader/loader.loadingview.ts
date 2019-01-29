import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './loader.loadingview.html',
  styleUrls: ['./loader.loadingview.scss']
})
export class LoaderLoadingViewComponent {
  @Input()
  what: string;

  @HostBinding('class.inline')
  inline = false;
}
