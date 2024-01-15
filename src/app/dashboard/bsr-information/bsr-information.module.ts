import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsrInformationComponent } from './bsr-information.component';
import { DropdownModule} from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule} from 'primeng/calendar';
import { FileUploadModule} from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule} from 'primeng/selectbutton';
import { GrowlModule } from 'primeng/growl';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SearchRecipientModule}from'../search-recipient/search-recipient.module';
import { WebcamModule} from'../../shared/components/webcam/webcam.module';
import { BdCurrenyModule } from'../../shared/pipes/bd-currency-format.pipe';
import { InwordAmountModule } from'../../shared/pipes/inword-amount.pipe';
import { CapitalizeFirstCharModule } from'../../shared/pipes/first-letter-capital.pipe';
import { InputBehaviorModule } from '../../shared/directives/input-behavior.module';
import { bsrInformationRoutes } from'./bsr-information-routing.module';
import { BsrInformationService } from'./bsr-information.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, DropdownModule, CalendarModule, FileUploadModule, DialogModule, 
        SelectButtonModule, InputBehaviorModule, SearchRecipientModule, WebcamModule, OverlayPanelModule,
        GrowlModule, BdCurrenyModule, InwordAmountModule, FormsModule, bsrInformationRoutes, TableModule,
        TooltipModule, CheckboxModule, CapitalizeFirstCharModule, ConfirmDialogModule
    ],
    declarations: [BsrInformationComponent],
    exports: [BsrInformationComponent],
    providers: [BsrInformationService, ConfirmationService]
})
export class BsrInformationModule { }
