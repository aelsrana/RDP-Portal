import { EmailValidator } from './email-validator';
import { NgModule } from '@angular/core';
import { OnlyNumber } from './only-number.directive';
import { TrimmedInput } from './trimmed-input.directive';
import { CurrencyInput } from './input-currency.directive';
import { ValidName } from './valid-name.directive';
import { DisableControlDirective } from 'src/app/shared/directives/disable.control.directive';

@NgModule({
    declarations: [OnlyNumber, TrimmedInput, CurrencyInput, ValidName, DisableControlDirective, EmailValidator ],
    exports: [OnlyNumber, TrimmedInput, CurrencyInput, ValidName, DisableControlDirective, EmailValidator]
})
export class InputBehaviorModule { }