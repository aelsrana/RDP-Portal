import { NgModule, Pipe, PipeTransform} from '@angular/core';
import { number2text } from '../helper/util.helper';

@Pipe({ name: 'inwordamount' })
export class InwordAmountPipe implements PipeTransform {
    transform(value: string) {
        if (value && value != "") {
            let amount = value.toString().replace(/,/g, '');
            return number2text(amount);
        }
    }
}

@NgModule({
    declarations: [InwordAmountPipe],
    exports: [InwordAmountPipe]
})
export class InwordAmountModule { }