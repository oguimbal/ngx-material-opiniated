import { Component } from '@angular/core';
import { delay } from './utils';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient) {
  }

  typeaheadSuggest = (text: string) => this.http.get<any[]>('https://restcountries.eu/rest/v2/name/' + encodeURIComponent(text))
        .pipe(map(x => x.slice(0, 5)))

  typeaheadCreate = () => alert('Please contact your local dictator for a how-to.');
}
