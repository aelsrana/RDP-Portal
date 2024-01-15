import { NgModule, Pipe, PipeTransform} from '@angular/core';
import { formateCurrency } from '../helper/util.helper';

@Pipe({ name: 'bdcurrency' })
export class BdCurrenyPipe implements PipeTransform {
    transform(value: string) {
        if (value && value != "") {
            let amount = value.toString().replace(/,/g, '');
            //let amount = (Math.round(parseFloat(value) * 100) / 100).toFixed(2);
            return formateCurrency(amount);
        }
    }
}

@NgModule({
    declarations: [BdCurrenyPipe],
    exports: [BdCurrenyPipe]
})
export class BdCurrenyModule { }
