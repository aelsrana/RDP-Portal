import { remittanceCardRoutes } from './remittance-card-routing.module';
import { RemittanceCardService } from './remittance-card.service';
import { RemittanceCardDetailComponent } from './remittance-card-detail.component';
import { RemittanceCardComponent } from './remittance-card.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import {TableModule} from 'primeng/table';
import { TranslateModule } from "@ngx-translate/core";
import { CustomMaterialModule } from "src/app/custom-material";
import { PageHeaderModule } from "src/app/shared";
import { SearchPanelModule } from "src/app/shared/components/search-panel/search-panel.module";
import { InputBehaviorModule } from "src/app/shared/directives/input-behavior.module";
import { LoadingImageModule } from "src/app/shared/loader/loading-image.module";
import { GrowlModule } from "primeng/growl";
import { NgxQRCodeModule } from 'ngx-qrcode2';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, remittanceCardRoutes,LoadingImageModule,
        TableModule, TranslateModule, CustomMaterialModule, PageHeaderModule, GrowlModule, SearchPanelModule, InputBehaviorModule, NgxQRCodeModule],
    declarations: [RemittanceCardComponent, RemittanceCardDetailComponent],
    providers: [RemittanceCardService]
})
export class RemittanceCardModule { }