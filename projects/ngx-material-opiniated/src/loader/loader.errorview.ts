import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'error-view',
  templateUrl: './loader.errorview.html',
  styleUrls: ['./loader.errorview.scss']
})
export class LoaderErrorViewComponent {
  @Input()
  what: string;
  @Input()
  details: string;
  showDetails: boolean;
  @Input()
  retry: () => void;

  @HostBinding('class.inline')
  inline = false;
  
  noPrefix = false;
}
