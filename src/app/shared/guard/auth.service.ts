import { Injectable } from "@angular/core";
import { AUTH_STORE_KEY } from "../constant/constant";
import { LOGIN_COOKIE_STORE_KEY, APPLICATION_NAME, CLIENT_ID, APP_AUTH_URL, CLIENT_AUTH_URL, USER_INFO_URL } from "../index";
import { Observable } from "rxjs";
import { Log, Level } from 'ng2-logger/client'
import { RequestLogin } from "../model/request/request.login";
import { AuthInfo } from "../model/request/auth.info";
import { ResponseUser } from "../model/response/response.user";
import { USER_AUTH_URL, CECURITY_URL } from "../constant/api";
import { AppStorageService, GlobalErrorHandler } from "../services/index";
import { RequestApplication } from "../model/request/request.application";
import { RequestClient } from "../model/request/request.client";
import { RestClient } from "../services/rest.client";
import { RequestUser } from "../model/request/request.user";
import { PATH } from "../constant/path";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {

    public token = AUTH_STORE_KEY;

    constructor(private appStorageService: AppStorageService, private restClient: RestClient, private errorHandler: GlobalErrorHandler,
        private _router: Router) { }

    get isLoggedIn(): boolean {
        return !!this.getAuthInfo();
    }

    public getAuthInfo() {
        return <AuthInfo>JSON.parse(this.appStorageService.getData(LOGIN_COOKIE_STORE_KEY));
    }

    public getUserInfo(loginId, roleId): Observable<any> {
        let requestQuery = new RequestUser();
        requestQuery.header.requestType = USER_INFO_URL;
        requestQuery.header.requestSourceService = "get-user-info-by-loginId";
        requestQuery.body.loginId = loginId;
        requestQuery.body.roleId = roleId;
        return this.restClient.post(CECURITY_URL + USER_INFO_URL, requestQuery);
    }

    public login(userId: string, password: string, token: string): Observable<any> {
        let requestLogin = new RequestLogin();
        requestLogin.header.requestType = USER_AUTH_URL;
        requestLogin.header.requestSourceService = "authenticate-user";
        requestLogin.body.applicationName = APPLICATION_NAME;
        requestLogin.body.authenticationToken = token;
        requestLogin.body.clientId = CLIENT_ID;
        requestLogin.body.userId = userId;
        requestLogin.body.password = password;
        return this.restClient.post(CECURITY_URL + USER_AUTH_URL, requestLogin);
    }

    public authorizeApplication(applicationName: string): Observable<any> {
        let requestApp = new RequestApplication();
        requestApp.header.requestType = APP_AUTH_URL;
        requestApp.header.requestSourceService = "authenticate-application";
        requestApp.body.applicationName = applicationName;
        return this.restClient.post(CECURITY_URL + APP_AUTH_URL, requestApp);
    }

    public authorizeClient(token: string): Observable<any> {
        let requestClient = new RequestClient();
        requestClient.header.requestType = CLIENT_AUTH_URL;
        requestClient.header.requestSourceService = "authenticate-client";
        requestClient.body.applicationName = APPLICATION_NAME;
        requestClient.body.authenticationToken = token;
        requestClient.body.clientId = CLIENT_ID;
        return this.restClient.post(CECURITY_URL + CLIENT_AUTH_URL, requestClient);
    }

    public logout(): void {
        try {
            this.appStorageService.removeData(AUTH_STORE_KEY);
            this.appStorageService.removeData(LOGIN_COOKIE_STORE_KEY);
            this.appStorageService.removeData('pageNum');
            this._router.navigate([PATH.LOGIN]);
        } catch (e) {
            const log = Log.create('logout', Level.ERROR, Level.WARN); 
            log.er(e);
            throw Error('Unable to remove from storage for Auth Information!!!');
        }
    } 

    public saveAuthInfo(value) {
        try {
            const info = <ResponseUser>value.json();
            this.appStorageService.setData(AUTH_STORE_KEY, JSON.stringify(info));
        } catch (e) {
            const log = Log.create('saveAuthInfo', Level.ERROR, Level.WARN);
            log.er(e);
            throw Error('Unable to save from storage for Auth Information!!!');
        }
    }
}