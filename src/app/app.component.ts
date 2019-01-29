import { Component } from '@angular/core';
import { delay } from './utils';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { INotificationService } from 'projects/ngx-material-opiniated/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  themeClass = 'light-theme';

  constructor(private http: HttpClient, private notif: INotificationService) {
  }

  typeaheadSuggest = (text: string) => this.http.get<any[]>('https://restcountries.eu/rest/v2/name/' + encodeURIComponent(text))
        .pipe(map(x => x.slice(0, 5)))

  typeaheadCreate = () => alert('Please contact your local dictator for a how-to.');


  // text validation
  validate = async (x: string) => {
    await delay(500);
    return x.length > 3 ? 'Too long' : null;
  }


  // button actions
  longAction = async () => await delay(1000);
  errorAction = async () => { await delay(1000); throw new Error('Told ya !'); };


    // grid source (can return an array, a promise of array, or observable of array)
    gridSource = () => [
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
  ]

  // tslint:disable-next-line: member-ordering
  editGridSource = [
      { firstName: 'Oui', lastName: 'Oui', male: true },
      { firstName: 'Jacques', lastName: 'Chirac', male: true },
      { firstName: 'Sailor', lastName: 'Moon', male: false }
  ];
  saveGridRow =  x => this.notif.success('Saved ' + x.firstName);
  deleteGridRow =  x => this.notif.info('Deleted ' + x.firstName);

}
