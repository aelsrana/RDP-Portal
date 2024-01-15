import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XpressMoneyComponent } from './xpress-money.component';

const routes: Routes = [
    {
        path: '',
        component: XpressMoneyComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class XpressMoneyRoutingModule {}
