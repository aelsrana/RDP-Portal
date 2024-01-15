import { Directive, HostBinding, HostListener } from '@angular/core';
import { NgModel, FormControlName } from '@angular/forms';

@Directive({
    selector: '[trimmed]',
    providers: [NgModel, FormControlName]
})
export class TrimmedInput {
    constructor(private model: NgModel, private formControlName: FormControlName) { }
    @HostListener("change", ["$event.target.value"])
    onInputChange(value) {
        let trimmedValue = value.replace(/\s+/g, ' ').trim();

        if (this.model) {
            this.model.viewToModelUpdate(trimmedValue);
            this.model.valueAccessor.writeValue(trimmedValue);
        }

        if (this.formControlName.control) {
            this.formControlName.viewToModelUpdate(trimmedValue);
            this.formControlName.valueAccessor.writeValue(trimmedValue);
            this.formControlName.control.parent.get(this.formControlName.name).setValue(trimmedValue);
        }
    }
}