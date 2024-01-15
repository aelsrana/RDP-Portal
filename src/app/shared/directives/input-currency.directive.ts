import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[CurrencyInput]'
})
export class CurrencyInput {
    constructor(private el: ElementRef) { }
    @Input() CurrencyInput: boolean;

    @HostListener('keydown', ['$event']) onKeyDown(event) {
        let e = <KeyboardEvent>event;
        if (this.CurrencyInput) {
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 190 || e.keyCode == 110 || e.keyCode == 8
                || e.keyCode == 37 || e.keyCode == 39) {
                let textboxValue = this.el.nativeElement.value;
                if (textboxValue.includes(".")) {
                    if ((e.keyCode == 190 || e.keyCode == 110)) {
                        e.preventDefault();
                    }
                }
                if (textboxValue.length == 0 && (e.keyCode == 190 || e.keyCode == 110)) {
                    e.preventDefault();
                }
            }
            else {
                if (e.keyCode != 9) {
                    e.preventDefault();
                }
            }
        }
    }

    @HostListener('keyup', ['$event']) onKeyUp(event) {
        let e = <KeyboardEvent>event;
        let textboxValue = (e.target as any).value;
        if (this.CurrencyInput && textboxValue != 0) {
            if ((e.keyCode == 190 || e.keyCode == 110)) {
                let textboxValue = this.el.nativeElement.value;
                if (textboxValue.split('.')[1].length > 2) {
                    this.el.nativeElement.value = textboxValue.substring(0, textboxValue.indexOf(".") + 3);
                }
            }

            if (textboxValue.includes(".") && textboxValue.split('.')[1].length > 2 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
                this.el.nativeElement.value = textboxValue.substring(0, textboxValue.indexOf(".") + 3);
            }
        }
    }
}