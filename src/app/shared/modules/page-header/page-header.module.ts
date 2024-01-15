import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PageHeaderComponent } from './page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/custom-material';

@NgModule({
    imports: [CommonModule, RouterModule, CustomMaterialModule, TranslateModule],
    declarations: [PageHeaderComponent],
    exports: [PageHeaderComponent]
})
export class PageHeaderModule {}
