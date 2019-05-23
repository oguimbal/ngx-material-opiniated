import {
    Component,
    ElementRef,
    forwardRef,
    HostListener,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    InjectionToken,
    Inject,
    Optional
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    Validator,
    ValidationErrors,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    FormGroupDirective,
    NgForm,
    AsyncValidator
} from '@angular/forms';
import { Country } from './country.model';
import { CountryService } from './country.service';
import { ErrorStateMatcher } from '@angular/material';

const PLUS = '+';

const COUNTER_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PhoneNumberComponent),
    multi: true
};

const VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PhoneNumberComponent),
    multi: true
};

export const PHONE_VALIDATOR = new InjectionToken('MAT-OPINIATED-PHONE-VALIDATOR');
export type PhoneValidator = (txt: string) => Promise<boolean>;

/* stolen from https://github.com/nikhiln/ngx-international-phone-number */
@Component({
    selector: 'phone-number',
    templateUrl: './phone.html',
    styleUrls: ['./phone.scss', './phone.flags.scss'],
    host: {
        '(document:click)': 'hideDropdown($event)'
    },
    providers: [COUNTER_CONTROL_ACCESSOR, VALIDATOR]
})
export class PhoneNumberComponent
    implements OnInit, ControlValueAccessor, AsyncValidator {
    // input
    @Input() placeholder = 'Enter phone number'; // default
    @Input() maxlength = 15; // default

    @Input() defaultCountry: string;
    @Input() required: boolean;
    @Input() allowDropdown = true;
    @Input() type = 'text';
    @Input() errorMessage = 'Invalid phone number';

    @Input() allowedCountries: Country[];

    @Input() validator: PhoneValidator;

    @Output() onCountryCodeChanged: EventEmitter<any> = new EventEmitter();

    // ELEMENT REF
    phoneComponent: ElementRef;
    isValidNumber: boolean;

    // CONTROL VALUE ACCESSOR FUNCTIONS
    onTouch: Function;
    onModelChange: Function;

    countries: Country[];
    selectedCountry: Country;
    countryFilter: string;
    showDropdown = false;
    phoneNumber = '';

    value = '';

    @ViewChild('phoneNumberInput') phoneNumberInput: ElementRef;
    validatingValue: any;

    /**
     * Util function to check if given text starts with plus sign
     * @param text
     */
    private static startsWithPlus(text: string): boolean {
        return text.startsWith(PLUS);
    }

    /**
     * Reduced the prefixes
     * @param foundPrefixes
     */
    private static reducePrefixes(foundPrefixes: Country[]) {
        const reducedPrefixes = foundPrefixes.reduce((first: Country, second: Country) =>
            first.dialCode.length > second.dialCode.length ? first : second
        );
        return reducedPrefixes;
    }

    constructor(
        private countryService: CountryService
        , @Optional() @Inject(PHONE_VALIDATOR) private _validator
        , private cd: ChangeDetectorRef
        , phoneComponent: ElementRef
    ) {
        this.phoneComponent = phoneComponent;
    }

    ngOnInit(): void {
        if (this.allowedCountries && this.allowedCountries.length) {
            this.countries = this.countryService.getCountriesByISO(this.allowedCountries);
        } else {
            this.countries = this.countryService.getCountries();
        }
        this.orderCountriesByName();
    }

    /**
     * Opens the country selection dropdown
     */
    displayDropDown() {
        if (this.allowDropdown) {
            this.showDropdown = !this.showDropdown;
            this.countryFilter = '';
        }
    }

    /**
     * Hides the country selection dropdown
     * @param event
     */
    hideDropdown(event: Event) {
        if (!this.phoneComponent.nativeElement.contains(event.target)) {
            this.showDropdown = false;
        }
    }

    /**
     * Sets the selected country code to given country
     * @param event
     * @param countryCode
     */
    updateSelectedCountry(event: Event, countryCode: string) {
        event.preventDefault();
        this.updatePhoneInput(countryCode);
        this.onCountryCodeChanged.emit(countryCode);
        this.updateValue();
        // focus on phone number input field
        setTimeout(() => this.phoneNumberInput.nativeElement.focus());
    }

    /**
     * Updates the phone number
     * @param event
     */
    updatePhoneNumber(event: Event) {
        if (PhoneNumberComponent.startsWithPlus(this.phoneNumber)) {
            this.findPrefix(this.phoneNumber.split(PLUS)[1]);
        } else {
            this.selectedCountry = null;
        }

        this.updateValue();
    }

    /**
     * shows the dropdown with keyboard event
     * @param event
     */
    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.showDropdown) {
            this.countryFilter = `${this.countryFilter}${event.key}`;
        }
    }

    /**
     * @param prefix
     */
    private findPrefix(prefix: string) {
        let foundPrefixes: Country[] = this.countries.filter((country: Country) =>
            prefix.startsWith(country.dialCode)
        );
        if (foundPrefixes && foundPrefixes.length) {
            this.selectedCountry = PhoneNumberComponent.reducePrefixes(foundPrefixes);
        } else {
            this.selectedCountry = null;
        }
    }

    /**
     * Sort countries by name
     */
    private orderCountriesByName() {
        this.countries = this.countries.sort(function (a, b) {
            return a['name'] > b['name'] ? 1 : b['name'] > a['name'] ? -1 : 0;
        });
    }

    /**
     *
     * @param fn
     */
    registerOnTouched(fn: Function) {
        this.onTouch = fn;
    }

    /**
     *
     * @param fn
     */
    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    /**
     *
     * @param value
     */
    writeValue(value: string) {
        this.value = value || '';
        this.phoneNumber = this.value;

        if (PhoneNumberComponent.startsWithPlus(this.value)) {
            this.findPrefix(this.value.split(PLUS)[1]);
            if (this.selectedCountry) {
                this.updatePhoneInput(this.selectedCountry.countryCode);
            }
        }

        if (this.defaultCountry) {
            this.updatePhoneInput(this.defaultCountry);
        }
    }

    /**
     * Validation
     * @param c
     */
    async validate(c: FormControl): Promise<ValidationErrors | null> {
        let value = c.value;
        // let selectedDialCode = this.getSelectedCountryDialCode();
        let validationError: ValidationErrors = {
            phoneEmptyError: {
                valid: false
            }
        };

        if (this.required && !value) {
            // if (value && selectedDialCode)
            //     value = value.replace(/\s/g, '').replace(selectedDialCode, '');

            // if (!value) return validationError;
            return validationError;
        }

        if (value && (this._validator || this.validator)) {

            try {
                this.validatingValue = value;
                const ret = await (this._validator || this.validator)(value);
                if (this.validatingValue === value)
                    this.isValidNumber = ret;
                return ret ? null : validationError;
            } catch (ex) {
                this.isValidNumber = false;
                return validationError;
            }
        }
        return null;
    }

    /**
     * Updates the value and trigger changes
     */
    private updateValue() {
        this.value = this.phoneNumber.replace(/ /g, '');
        if (this.onModelChange)
            this.onModelChange(this.value);
        if (this.onTouch)
            this.onTouch();
    }

    /**
     * Updates the input
     * @param countryCode
     */
    private updatePhoneInput(countryCode: string) {
        this.showDropdown = false;

        let newInputValue: string = PhoneNumberComponent.startsWithPlus(
            this.phoneNumber
        )
            ? `${this.phoneNumber
                .split(PLUS)[1]
                .substr(
                    this.selectedCountry.dialCode.length,
                    this.phoneNumber.length
                )}`
            : this.phoneNumber;

        this.selectedCountry = this.countries.find(
            (country: Country) => country.countryCode === countryCode
        );
        if (this.selectedCountry) {
            this.phoneNumber = `${PLUS}${
                this.selectedCountry.dialCode
                } ${newInputValue.replace(/ /g, '')}`;
        } else {
            this.phoneNumber = `${newInputValue.replace(/ /g, '')}`;
        }
    }

    /**
     * Returns the selected country's dialcode
     */
    public getSelectedCountryDialCode(): string {
        if (this.selectedCountry) { return PLUS + this.selectedCountry.dialCode; };
        return null;
    }
}