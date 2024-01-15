import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { XpressMoneyRoutingModule } from './xpress-money-routing.module';
import { XpressMoneyComponent } from './xpress-money.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [CommonModule, FormsModule, XpressMoneyRoutingModule],
    declarations: [XpressMoneyComponent]
})
export class XpressMoneyModule {}
