import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { TableModule} from 'primeng/table';
import { TranslateModule } from "@ngx-translate/core";
import { CustomMaterialModule } from "src/app/custom-material";
import { PageHeaderModule } from "src/app/shared";
import { SearchPanelModule } from "src/app/shared/components/search-panel/search-panel.module";
import { RemittanceEditComponent } from "src/app/dashboard/remittance-edit/remittance-edit.component";
import { RemittanceEditService } from "src/app/dashboard/remittance-edit/remittance-edit.service";
import { remittanceEditRoutes } from "src/app/dashboard/remittance-edit/remittance-edit-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingImageModule } from "src/app/shared/loader/loading-image.module";
import { GrowlModule } from "primeng/growl";

@NgModule({
    imports: [CommonModule, FormsModule, DialogModule, remittanceEditRoutes, GrowlModule, NgbModule.forRoot(), LoadingImageModule,
        TableModule, TranslateModule, CustomMaterialModule, PageHeaderModule, SearchPanelModule],
    declarations: [RemittanceEditComponent],
    providers: [RemittanceEditService]
})
export class RemittanceEditModule { }