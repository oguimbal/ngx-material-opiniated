# Demo [See it in action here](https://oguimbal.github.io/ngx-material-opiniated/index.html)


**This package is built for Angular 9... for Angular 7 users, please install version <=0.0.33**

# Inputs & common components (OpiniatedInputsModule)

Import using `OpiniatedNotificationModule` on your root module.

## Textbox/textarea: txt

### Usage

![alt text](https://raw.githubusercontent.com/oguimbal/ngx-material-opiniated/master/images/text.png)

Example (html)
```html
 <txt [(ngModel)]="value" icon="check"></txt>
```

[Source is here](https://github.com/oguimbal/ngx-material-opiniated/blob/master/projects/ngx-material-opiniated/src/inputs/text.ts)

### Inputs

Property | Type | Description
--- | --- | ---
placeholder | `string` | The input placeholder
info | `string` | Tip displayed below input
multiline | `boolean` | If true, then this is an auto-resizing textarea
name | `string` | Name of the input
icon | `string` | A fontawsome-like icon (will be set as a class of a "i" tag)
iconColor | `string` | Color of the icon
readonly | `boolean` | Sets the input as readonly
disabled | `boolean` | Sets the input as disabled
validator | `(value: string) => text \| Promise<text> ` | A value validator. Will be called when user types a value. Must return the error to show to the user if value is invalid
checkOnInit | `boolean` | If true, then the value validator will be called when loading the component
type | `'text' \| 'number'` | Type of input
action | `(value: string) => void \| Promise<void>` | If present, then a button will bi shown as suffix which triggers this action
actionIcon | `text` | Similar to `icon` but for the action button


### Events

Event | Event type | Description
--- | --- | ---
(return) | - | Called when user press Enter
(escape) | - | Called when user press Escape
(focused) | - | Called when input got focus
(keyup) | KeyboardEvent | On key up
(blur) | - | On blur



## Date time picker: datetime

### Usage

![alt text](https://raw.githubusercontent.com/oguimbal/ngx-material-opiniated/master/images/datetime.png)

Uses [ng-pick-datetime](https://github.com/DanielYKPan/date-time-picker)

Example (html)
```html
 <datetime [(value)]="myDate" ></datetime>
```

### Inputs

Property | Type | Description
--- | --- | ---
inline | `boolean` | If true, then the date picker will be shown inline
placeholder | `string` | The input placeholder
name | `string` | The input name
minDate | `string \| Date \| Moment` | Min date acceptable
maxDate | `string \| Date \| Moment` | Max date acceptable
showClear | `boolean` | Show a "clear" button
disabled | `boolean` | Enabled/disabled
readonly | `boolean` | puts the input as readonly
dialog | `boolean` | Shows a dialog instead of a popup below input
pickerType | `'both' \| 'calendar' \| 'timer'` | Picker type (defaults to `calendar`)
type | `'date' \| 'moment'` | Which kind of date representation to use (defaults to `moment`)


## Checkbox:  check

A simple checkbox. Usage:

```html
 <check [(value)]="myDate" [readonly]="true" ></check>
```

## Button (with loader actions):  btn

## Usage

![alt text](https://raw.githubusercontent.com/oguimbal/ngx-material-opiniated/master/images/button-still.png)
![alt text](https://raw.githubusercontent.com/oguimbal/ngx-material-opiniated/master/images/button.png)

A material button with lots of functionalities


[Source is here](https://github.com/oguimbal/ngx-material-opiniated/blob/master/projects/ngx-material-opiniated/src/inputs/btn.ts)

```html
 <btn [action]="methodToCall" ></btn>
```

(ts)
```typescript
 methodToCall = async () => {
     // do something asynchronously.
     // Will show a loader while performing this action (spinning wheel)
     // if promise throws, then an error toast will be shown
 }
```

### Inputs

Property | Type | Description
--- | --- | ---
action | `() => void \| Promise<void>` | An action that will be performed when the button is clicked. A spinning wheel will be shown while this action is performed, and an error toast will pop if it fails. The button will not be clickable meanwhile.
icon | `string` | A fontawsome-like icon (will be set as a class of a "i" tag)
color | `'primary' \| 'accent' \| 'warn' \| undefined` | A color corresponding to your material theme
loading | `boolean` | Manually triggers the "loading" state of the button, or reads if the button is currently performing an action
disabled | `boolean` | Puts the button in a disabled non clickable state
type | `'stroked' \| 'raised' \| 'icon' \| 'flat' \| 'basic' \| 'fab' \| 'minifab' \| 'minifab-content'` | Button type (defaults to `raised`). NB: fab buttons do not accept content, but you can set the `icon` property



# Notifications / Prompt / Toasts (OpiniatedNotificationModule)


![alt text](https://raw.githubusercontent.com/oguimbal/ngx-material-opiniated/master/images/toast.png)

Provides a way to inject a notification service

Import using `OpiniatedNotificationModule.forRoot()` on your root module, or `OpiniatedNotificationModule` on children modules

### Usage

```typescript

class MyComponent {
    constructor(private notif: INotificationService) {
    }

    async method() {
        // show toasts
        this.notif.default('a toast');
        this.notif.success('a toast');
        this.notif.info('a toast');
        this.notif.warn('a toast');
        this.notif.error('a toast');

        // show a message dialog (with an OK button, and wait for its dismissal)
        await this.notif.alert('Message text', 'Optional title');


        // Asks the user a question (with a ok/cancel answer), and returns true if clicked OK
        if (!(await this.notif.alert('Question ?', 'Optional title')))
            return;

        // Asks the user a question (with a save/discard answer), and returns true if clicked Save
        if (!(await this.notif.saveOrDiscard('Save ?', 'Optional title')))
            return;


        // Prompts the user a value (returns undefined if user cancelled)
        // NB: the last argument,is the text that will be originally selected (useful for file names, selected without extension by default)
        const value = await this.notif.prompt('Input a file name', 'Optional title', 'initial file name.jpg', 'initial file name')))
            return;
        console.log('File name: ', value);

        // Asks the user a question (with a save/discard answer), and returns true if clicked Save
        if (!(await this.notif.confirmWithText('Type "lets go" to confirm', 'Optional title', 'lets go'))) {
            console.log ('user has not confirmed')
            return;
        }
    }
}
```

# Typeahead / Suggested options  (OpiniatedTypeaheadModule)


![alt text](https://raw.githubusercontent.com/oguimbal/ngx-material-opiniated/master/images/typeahead.png)

A typeahead, 2 lines setup.

[Source is here](https://github.com/oguimbal/ngx-material-opiniated/blob/master/projects/ngx-material-opiniated/src/typeahead/typeahead.ts)

## Usage


```html
    <typeahead [source]="myDataSource"
                placeholder="Search a country"
                [initialValue]="typaheadInitial"
                [create]="createNew"
                (valueChange)="setValue($event)"
                displayWith="name">
    </typeahead>
```

## ... static data source
```typescript
    myDataSource = [{name: 'Country 1'}, {name: 'Country 2'}, {name: 'Country 3'}]
```


## ... code data-source

```typescript

  typaheadInitial = () => this.http.get<any[]>('https://restcountries.eu/rest/v2/name/fra')
        .pipe(map(x => x[0]))

  myDataSource = (text: string) => this.http.get<any[]>('https://restcountries.eu/rest/v2/name/' + encodeURIComponent(text))
        .pipe(map(x => x.slice(0, 5)))

  createNew = async (typedText: string) => {
      // create a value (asynchronously), then return it.
  }

```

## Inputs

Property | Type | Description
--- | --- | ---
source | `T[] \| ((txt: string) => ObservableInput<T[]>)` | The data source used to fill results
displayWith | `string \| ((x: T) => string[])` | Which text to show to the user for each result ? (can be either a property name, or a function)
placehoder | `string` | Input placeholder
searchWhenEmpty | `boolean` | Should the datasource be called when no text has been typed ? (defaults to false)
create | `(text: string) => Promise<T>` | If provided, then a "create" button will be shown when user inputs text. This function will be called when user clicks it



## Events
Event | Event type | Description
(valueChange) | T | Called when user selects an option
(blur) | - | Called when the typeahead loses focus
(emptyValue) | - | Called when the user has deleted the currently selected value (when pressed backspace after selecting the current value)



# Phone input (OpiniatedPhoneModule)

![alt text](https://raw.githubusercontent.com/oguimbal/ngx-material-opiniated/master/images/phone.png)

A phone input.

[Source is here](https://github.com/oguimbal/ngx-material-opiniated/blob/master/projects/ngx-material-opiniated/src/phone/phone.ts)

This input is an adaptation of [this one](https://github.com/nikhiln/ngx-international-phone-number) (which was broken for me)

**WARNING:** This does not provide a validator by default. You will have to declare your own if you with to perform extensive validation (ex: to check if a phone number is valid). `google-libphonenumber` can help you with that, but it is a bit heavy so it is not included by default in this module (several 100's kB)

## Usage

```html
    <phone-number [defaultCountry]="'fr'" [(ngModel)]="phoneNumber"></phone-number>
```

if you with to use `google-libphonenumber` as a phone validator, import this module using:
```typescript

    async function validatePhone(phone: string) {
        // avoid putting this heavy lib in your main bundle, import it dynamically (if supported by your setup)
        const glibphone = await import (/* webpackChunkName: "google-libphone" */ 'google-libphonenumber');
        // ...or import with a classical import on your file header:  import * as glibphone from 'google-libphonenumber';

        const phoneUtil = glibphone.PhoneNumberUtil.getInstance();
        const phoneNumber = phoneUtil.parse(phone);
        const isValidNumber = phoneUtil.isValidNumber(phoneNumber);
        return isValidNumber;
    }

    OpiniatedPhoneModule.forRoot({
        validator: validatePhone
    })
```


# Loader / spinner (OpiniatedLoaderModule)

Provides a simple way to load things


[Source is here](https://github.com/oguimbal/ngx-material-opiniated/blob/master/projects/ngx-material-opiniated/src/loader/loader.ts)

## Usage

```html
<div *loader="myLoader">
    <!--
        Below expression would have thrown without the loader, but it works.
        The content of this block is replaced by a spinning wheel while loading,
        and its content is only instanciated when loaded.
     -->

    {{profile.property.name}}
</div>
```

```typescript

myLoader = async () => {
     // load content asynchronously
     // an error screen will be shown (with a "retry" button) if this method fails
    this.profile = await fetch('<profile url>')
}

```


**Optional loader properties**

Inline (small) laoder
```html
<div *loader="myLoader; inline: true">
```

Show what is currently loading (will show "Loading some content" while loading)
```html
<div *loader="myLoader; what: 'some context'">
```


Show what is currently loading, without prefix (will only show "some content" while loading)
```html
<div *loader="myLoader; what: 'some context'; noPrefix: true">
```



# Automatically generated grid (OpiniatedGridModule)


![alt text](https://raw.githubusercontent.com/oguimbal/ngx-material-opiniated/master/images/grid.png)

A balzingly fast-to-setup grid


## Basic usage

```html
<grid [source]="gridSource" columns="item, price, buy, commestible"></grid>
```
```typescript
    gridSource = async () => {
        // asynchronously (or synchronously) load the grid content.
        // column list & column widgets will be infered from data itself (see supported types)
        return [
            {item: 'Rice', commestible: true, price: {cur: 'EUR', amt: 3.5}, buy: () => this.notif.info('你是中囯的吗') },
            {item: 'Macbook', price: {cur: 'USD', amt: 125443.5}, buy: () => this.notif.error('Congrats, Apple now owns your life.') },
            ];
    }

```

## Auto supported types (automatically infered column types)

**Basic types**: number, string, date

**Curency**: Must have format like `{cur: 'USD', amt: 123}`

**Actions**: Functions properties will be shown as buttons on which user can click

### Custom columns

You can define custom display for some columns like that:

```html
<grid [source]="gridSource" columns="item, price, buy, commestible">
    <ng-template gridColumn="item" let-i>
        <b> {{i.item}} </b>
        <span *ngIf="i.commestible"> (eat me !)</b>
    </ng-template>
</grid>
```

Here, the column "item" will be shown using the given template.


## Openable column details

You can define templates that will make rows "open" when clicking on some columns.
This is done like that:


```html
<grid [source]="gridSource" columns="item, price, buy, commestible">
    <ng-template gridOpenColumn="price" let-i>
        You can buy {{i.item}} for almost nothing !
    </ng-template>
</grid>
```

Here, when clicking on "price", the row will open to show some details

## Editability

For a grid to be editable, you must set one or more of these properties on your grid: `onSave`, `onDelete`.

Moreover, if `canAdd` property is set, then a button will be displayed to add a new row to the grid.

```html
    <grid [source]="editGridSource"
        [canSearch]="false"
        [onSave]="saveGridRow"
        canAdd="Add some weird personage"
        [onDelete]="deleteGridRow">
    </grid>
```

```typescript
  saveGridRow =  async item => {
      // save 'item'
  }
  deleteGridRow =  async item => {
      // delete 'item'
  }
```



## Custom model

To have more control on how things are displayed, you can wrap your data items in "model" classes with custom decorators, like this one:

```typescript

class MyItemModel {
    constructor(private item) {

    }

    @showGrid({ name: 'Full name' type: 'string' })
    get myCustomProperty() {
        return this.item.firstName + ' ' + this.item.lastName
    }


    @showGrid({
        name: 'Send letter',
        type: 'action',
        icon: 'fa fa-trash',
        confirm: {
            title: 'Are you sure ?',
            yes: 'Of course !'
        }
    })
    async callAction() {
        // some function that will be called when user clicked on button & confirmed.
    }
}
```


## Inputs

Property | Type | Description
--- | --- | ---
gridTitle | `string` | A title for your grid
source | `T[] \| () => (T [] \| Promise<T[]>)`  | Your grid data source
pageLength | `number` | Grid page size (defaults to 30)
columns | `string` | Columns definitions (comma separated string)
canSearch | `boolean` | If true, then a quick filter box is shown
canFilter | `boolean` | If true, then a filter will be shown for each column
rowContextMenu | `context-menu` | A context menu for rows, which subject is the row item (see [ngx-contextmenu](https://github.com/isaacplmann/ngx-contextmenu))
cellClass | `(value: any, col: Column, elt: any) => string` | A function that can return a CSS class that will be applied to the given cell
searchPlaceholder |  `string` |  Searchbox placeholder
canSort | `boolean` | If true, then columns will be sortable (when supported type)
onSave | `(elt: any) => void\|any\|Promise<any>` | Function that will be called when saving item
onDelete | `(elt: any) => void\|any\|Promise<any>` | Function that will be called when deleting item
canAdd | `string \| boolean` | If set, then a button will be shown to add new items
add | `() => void` | If set, then this function will be called when clicked on "create new item"
create | `() => T` | If set, then this function will be used to create new blank items when clicked on "create new item"
customFilter | `(search: string, item: any) => boolean` | A custom predicate to filter items



## Events

Event | Event type | Description
--- | --- | ---
(rowClick) | `T` | On row click
