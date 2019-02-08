import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { INotificationService } from 'projects/ngx-material-opiniated/src/public_api';
import { OverlayContainer } from '@angular/cdk/overlay';
import { delay } from '@oguimbal/utilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  themeClass: string;

  constructor(private http: HttpClient, private notif: INotificationService, private overlayContainer: OverlayContainer) {
    this.setTheme('light-theme');
  }
  setTheme(effectiveTheme: string): any {
    const classList = this.overlayContainer.getContainerElement().classList;
    const toRemove = Array.from(classList).filter((item: string) =>
      item.includes('-theme')
    );
    if (toRemove.length) {
      classList.remove(...toRemove);
    }
    classList.add(effectiveTheme);
    this.themeClass = effectiveTheme;
  }

  typaheadInitial = () => this.http.get<any[]>('https://restcountries.eu/rest/v2/name/fra')
        .pipe(map(x => x[0]))

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
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
      {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
      {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') }
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
