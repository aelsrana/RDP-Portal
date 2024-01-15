import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { TableModule} from 'primeng/table';
import { TranslateModule } from "@ngx-translate/core";
import { CustomMaterialModule } from "src/app/custom-material";
import { PageHeaderModule } from "src/app/shared";
import { SearchPanelModule } from "src/app/shared/components/search-panel/search-panel.module";
import { remittanceRoutes } from "src/app/dashboard/remittance-all/remittance-routing.module";
import { RemittanceComponent } from "src/app/dashboard/remittance-all/remittance.component";
import { RemittanceService } from "src/app/dashboard/remittance-all/remittance.service";
import { RemittanceDetailComponent } from "src/app/dashboard/remittance-all/remittance-detail.component";
import { InputBehaviorModule } from "src/app/shared/directives/input-behavior.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingImageModule } from '../../shared/loader/loading-image.module'
import { GrowlModule } from "primeng/growl";

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, remittanceRoutes, NgbModule.forRoot(), LoadingImageModule,
        TableModule, TranslateModule, CustomMaterialModule, GrowlModule, PageHeaderModule, SearchPanelModule, InputBehaviorModule],
    declarations: [RemittanceComponent, RemittanceDetailComponent],
    providers: [RemittanceService]
})
export class RemittanceModule { }