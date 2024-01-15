import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SearchRecipientComponent } from './search-recipient.component';
import { SearchRecipientService } from "./search-recipient.service";
import { InputBehaviorModule } from '../../shared/directives/input-behavior.module';
import { LoadingImageModule } from '../../shared/loader/loading-image.module';
import { GrowlModule } from 'primeng/growl';

@NgModule({
    imports: [CommonModule, FormsModule, DialogModule, InputBehaviorModule, ZXingScannerModule.forRoot(), LoadingImageModule, GrowlModule],
    declarations: [SearchRecipientComponent],
    exports: [SearchRecipientComponent],
    providers: [SearchRecipientService]
})
export class SearchRecipientModule { }