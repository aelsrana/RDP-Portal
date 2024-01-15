import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
//import { routerTransition } from '../router.animations';
import { AUTH_STORE_KEY, LOGIN_COOKIE_STORE_KEY, APPLICATION_NAME } from '../shared/index';
import { AuthInfo } from '../shared/model/request/auth.info';
import { MessageService, AppStorageService } from '../shared/services/index';
import { AuthService } from '../shared/guard/index';
import { PATH } from '../shared/constant/path';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
    //,animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    user = new AuthInfo();
    token = AUTH_STORE_KEY;
    accessToken = AUTH_STORE_KEY;
    @Input() public msgs: Array<any> = [];

    constructor(public router: Router, private messagesService: MessageService, private authService: AuthService
        , private _appStorageService: AppStorageService, private _router: Router) {

    }

    ngOnInit() {
        if (this._appStorageService.getData(JSON.stringify(LOGIN_COOKIE_STORE_KEY))) {
            this._router.navigate([PATH.EMPTY]);
        }
        else {
            this._appStorageService.removeData(AUTH_STORE_KEY);
            this._appStorageService.removeData(LOGIN_COOKIE_STORE_KEY);
            this.authorizeApplication();
        }
    }

    getUserInfo(loginId: string, roleId: string) {
        this.authService.getUserInfo(loginId, roleId)
            .subscribe(resData => {
                if (resData.body.menuJson == undefined) {
                    this.user.password = "";
                    this.user.userId = "";
                    this.msgs = this.messagesService.showInfo("You are not authorized to login in portal");
                    this.authorizeApplication();
                    setTimeout(() => {
                        this.msgs = this.messagesService.clear();
                    }, 5000);
                    return
                }
                if (resData != null && resData.header.responseCode == '200') {
                    this._appStorageService.setData(LOGIN_COOKIE_STORE_KEY, JSON.stringify(resData['body']));
                    if (resData.body.resetRequired == 'Yes') {
                        this._router.navigate([PATH.EMPTY]);
                        //this._router.navigate([PATH.CHANGE_PASSWORD]);
                    } else {
                        this._router.navigate([PATH.EMPTY]);
                    }
                    this._appStorageService.removeData('authToken')

                } else {
                    this._router.navigate([PATH.LOGIN]);
                    this.msgs = this.messagesService.showInfo(resData.header.responseMessage);
                    setTimeout(() => {
                        this.msgs = this.messagesService.clear();
                    }, 3000);
                }
            });
    }

    onLoggedin(user) {

        if (!this.validateAuthentication(user)) {
            return
        };
        this.authService.login(user.userId, user.password, this.accessToken)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this._appStorageService.setData(AUTH_STORE_KEY, resData['body']['accessToken']);
                    this.getUserInfo(resData['body']['userId'], resData['body']['roleId']);
                } else {
                    if(resData.header.responseMessage == 'No user/password found'){
                        this.msgs = this.messagesService.showInfo(resData.header.responseMessage); 
                    }else{
                        this.msgs = this.messagesService.showInfo("Please check you connection and try again!!");
                    }                
                    this.authorizeApplication();
                    this.user.password ="";
                    setTimeout(() => {
                        this.msgs = this.messagesService.clear();
                    }, 3000);
                }
            });
    }


    keyDownFunction(e: any) {

    }

    closeMsg() {
        this.msgs = [];
    }

    authorizeApplication() {
        this.authService.authorizeApplication(APPLICATION_NAME)
            .subscribe(resData => {
                this.token = resData['body']['authenticationToken'];
                this.authorizeClient();
            });
    }

    authorizeClient() {
        this.authService.authorizeClient(this.token)
            .subscribe(resData => {
                this.accessToken = resData['body']['authenticationToken'];
            });
    }

    validateAuthentication(user): boolean {
        if (user.userId == null || user.userId == "") {
            this.msgs = this.messagesService.showWarn('User Required');
            setTimeout(() => {
                this.msgs = this.messagesService.clear()
            }, 3000);
            return false
        }
        if (user.password == null || user.password == "") {
            this.msgs = this.messagesService.showWarn('Password required');
            setTimeout(() => {
                this.msgs = this.messagesService.clear()
            }, 3000);
            return false
        }
        return true;
    }

}
