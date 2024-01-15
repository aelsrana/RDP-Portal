import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { TableModule} from 'primeng/table';
import { TranslateModule } from "@ngx-translate/core";
import { CustomMaterialModule } from "src/app/custom-material";
import { PageHeaderModule } from "src/app/shared";
import { SearchPanelModule } from "src/app/shared/components/search-panel/search-panel.module";
import { InputBehaviorModule } from "src/app/shared/directives/input-behavior.module";
import { remittanceDisburseRoutes } from "src/app/dashboard/remittance-disburse/remittance-disburse-routing.module";
import { RemittanceDisburseComponent } from "src/app/dashboard/remittance-disburse/remittance-disburse.component";
import { RemittanceDisburseService } from "src/app/dashboard/remittance-disburse/remittance-disburse.service";
import { LoadingImageModule } from "src/app/shared/loader/loading-image.module";
import { GrowlModule } from "primeng/growl";

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, GrowlModule,remittanceDisburseRoutes, LoadingImageModule,
        TableModule, TranslateModule, CustomMaterialModule, PageHeaderModule, SearchPanelModule, InputBehaviorModule],
    declarations: [RemittanceDisburseComponent],
    providers: [RemittanceDisburseService]
})
export class RemittanceDisburseModule { }