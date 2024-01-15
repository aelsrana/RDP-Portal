import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MessageService, GlobalErrorHandler } from '../shared/services/index';
import { AuthService } from '../shared/guard/index';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RestClient } from '../shared/services/rest.client';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [CommonModule, FormsModule, LoginRoutingModule, HttpModule, NgbAlertModule.forRoot()],
    declarations: [LoginComponent],
    providers:[MessageService, AuthService, RestClient, ], 
})
export class LoginModule {}
