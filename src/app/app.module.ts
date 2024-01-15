import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard, AuthService } from './shared/guard/index';
import { AppStorageService, GlobalErrorHandler, NavigatorService } from './shared/services/index';
import { RestClient } from './shared/services/rest.client';
import { HttpModule } from '@angular/http';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { LoadingImageModule } from 'src/app/shared/loader/loading-image.module';
import { RoleBaseAuthGuard } from 'src/app/shared/services/role-auth-guard';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        LoadingImageModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    providers: [AuthGuard, RoleBaseAuthGuard, AppStorageService,  AuthService, RestClient, 
        NavigatorService, GlobalErrorHandler, LoaderService],
    bootstrap: [AppComponent]
})
export class AppModule {}
