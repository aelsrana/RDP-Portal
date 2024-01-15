import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { TableModule} from 'primeng/table';
import { TranslateModule } from "@ngx-translate/core";
import { CustomMaterialModule } from "src/app/custom-material";
import { PageHeaderModule } from "src/app/shared";
import { GrowlModule } from 'primeng/growl';
import { SearchPanelModule } from "src/app/shared/components/search-panel/search-panel.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { remittanceMyApproveRoutes } from "src/app/dashboard/remittance-my-approve/remittance-my-approve-routing.module";
import { RemittanceMyApproveComponent } from "src/app/dashboard/remittance-my-approve/remittance-my-approve.component";
import { RemittanceMyApproveDetailComponent } from "src/app/dashboard/remittance-my-approve/remittance-my-approve-detail.component";
import { RemittanceMyApproveService } from "src/app/dashboard/remittance-my-approve/remittance-my-approve.service";
import { InputBehaviorModule } from "src/app/shared/directives/input-behavior.module";
import { LoadingImageModule } from "src/app/shared/loader/loading-image.module";
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
    imports: [CommonModule, FormsModule, DialogModule, remittanceMyApproveRoutes, NgbModule.forRoot(), ReactiveFormsModule, LoadingImageModule, CheckboxModule,
        TableModule, TranslateModule, CustomMaterialModule, PageHeaderModule, SearchPanelModule, GrowlModule, InputBehaviorModule],
    declarations: [RemittanceMyApproveComponent, RemittanceMyApproveDetailComponent],
    providers: [RemittanceMyApproveService]
})
export class RemittanceMyApproveModule { }