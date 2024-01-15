import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { TableModule} from 'primeng/table';
import { TranslateModule } from "@ngx-translate/core";
import { CustomMaterialModule } from "src/app/custom-material";
import { PageHeaderModule } from "src/app/shared";
import { SearchPanelModule } from "src/app/shared/components/search-panel/search-panel.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RemittanceApproveService } from "src/app/dashboard/remittance-approve/remittance-approve.service";
import { remittanceApproveRoutes } from "src/app/dashboard/remittance-approve/remittance-approve-routing.module";
import { RemittanceApproveComponent } from "src/app/dashboard/remittance-approve/remittance-approve.component";
import { LoadingImageModule } from "src/app/shared/loader/loading-image.module";
import { GrowlModule } from "primeng/growl";

@NgModule({
    imports: [CommonModule, FormsModule, DialogModule, remittanceApproveRoutes, GrowlModule, NgbModule.forRoot(), LoadingImageModule,
        TableModule, TranslateModule, CustomMaterialModule, PageHeaderModule, SearchPanelModule],
    declarations: [RemittanceApproveComponent],
    providers: [RemittanceApproveService]
})
export class RemittanceApproveModule { }