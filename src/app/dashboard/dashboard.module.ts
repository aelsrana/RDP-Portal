import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NavigationLinkComponent } from './navigation-link/navigation-link.component';
import { MessageService } from '../shared/services/index';
import { UtilService } from 'src/app/shared/services/util.service';
import { StatusService } from 'src/app/shared/services/status.service';
import { ChartModule } from 'primeng/chart';
import { GrowlMessageService } from 'src/app/shared/services/growl.message.service';
import { CustomMaterialModule } from 'src/app/custom-material';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        TranslateModule,
        ChartModule,
        NgbDropdownModule.forRoot(),
        CustomMaterialModule
    ],
    declarations: [DashboardComponent, FooterComponent, HeaderComponent, NavigationLinkComponent],
    providers:[MessageService, GrowlMessageService, UtilService, StatusService]
})
export class DashboardModule {}
