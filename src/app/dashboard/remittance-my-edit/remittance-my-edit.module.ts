import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { TableModule } from 'primeng/table';
import { TranslateModule } from "@ngx-translate/core";
import { CustomMaterialModule } from "src/app/custom-material";
import { PageHeaderModule } from "src/app/shared";
import { GrowlModule } from 'primeng/growl';
import { SearchPanelModule } from "src/app/shared/components/search-panel/search-panel.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RemittanceMyEditService } from "src/app/dashboard/remittance-my-edit/remittance-my-edit.service";
import { RemittanceMyEditComponent } from "src/app/dashboard/remittance-my-edit/remittance-my-edit.component";
import { remittanceMyEditRoutes } from "src/app/dashboard/remittance-my-edit/remittance-my-edit-routing.module";
import { RemittanceMyEditDetailComponent } from "src/app/dashboard/remittance-my-edit/remittance-my-edit-detail.component";
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { SearchRecipientModule } from '../search-recipient/search-recipient.module';
import { WebcamModule } from '../../shared/components/webcam/webcam.module';
import { BdCurrenyModule } from '../../shared/pipes/bd-currency-format.pipe';
import { InwordAmountModule } from '../../shared/pipes/inword-amount.pipe';
import { CapitalizeFirstCharModule } from '../../shared/pipes/first-letter-capital.pipe';
import { InputBehaviorModule } from '../../shared/directives/input-behavior.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RemittanceMyEditDetailService } from './remittance-my-edit-detail.service';
import { LoadingImageModule } from "src/app/shared/loader/loading-image.module";

@NgModule({
    imports: [CommonModule, FormsModule, DialogModule, remittanceMyEditRoutes, NgbModule.forRoot(),
        TableModule, TranslateModule, CustomMaterialModule, PageHeaderModule, SearchPanelModule, GrowlModule,
        ReactiveFormsModule, DropdownModule, CalendarModule, FileUploadModule, LoadingImageModule,
        SelectButtonModule, InputBehaviorModule, SearchRecipientModule, WebcamModule, OverlayPanelModule,
        BdCurrenyModule, InwordAmountModule, TooltipModule, CheckboxModule, CapitalizeFirstCharModule, ConfirmDialogModule],
    declarations: [RemittanceMyEditComponent, RemittanceMyEditDetailComponent],
    providers: [RemittanceMyEditService, RemittanceMyEditDetailService, ConfirmationService]
})
export class RemittanceMyEditModule { }