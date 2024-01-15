import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalizeFirstChar'
})
export class CapitalizeFirstCharPipe implements PipeTransform {
    transform(value: string, args: any[]): string {
        if (value === null || value != undefined) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
}

@NgModule({
    declarations: [CapitalizeFirstCharPipe],
    exports: [CapitalizeFirstCharPipe]
})
export class CapitalizeFirstCharModule { }