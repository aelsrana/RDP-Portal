import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[validName]'
})
export class ValidName {
    private previousValue: string;
    constructor(private el: ElementRef) { }
    @HostListener('paste') onPaste() {
            this.previousValue = this.el.nativeElement.value;
            setTimeout(() => {
                if (!/^[a-z .-]+$/i.test(this.el.nativeElement.value)) {
                    this.el.nativeElement.value = this.previousValue;
                }
            });
    }
    @HostListener('keydown', ['$event']) onKeyDown(event) {
        let e = <KeyboardEvent>event;
        if (!/^[a-z .-]+$/i.test(e.key)) {
            e.preventDefault();
        }
    }
}