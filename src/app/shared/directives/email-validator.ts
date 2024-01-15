import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator, AbstractControl } from '@angular/forms';

function validateEmailFactory() {
  debugger
  return (c: FormControl) => {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    return EMAIL_REGEXP.test(c.value) ? null : {
      validateEmail: {
        valid: false
      }
    };
  };
}

@Directive({
  selector: '[validateEmail][ngModel],[validateEmail][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidator), multi: true }
  ]
})
export class EmailValidator implements Validator{

  validator: Function;

  constructor( @Attribute('validateEqual') public validateEqual: string) {
    this.validator = validateEmailFactory();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  
}