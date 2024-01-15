import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NavigationExtras } from '@angular/router/src/router';
import { PATH } from '../constant/path';
import { LoginInfo } from 'src/app/shared/model/response/loginInfo';
import { AuthService } from 'src/app/shared/guard';
import { AppStorageService } from 'src/app/shared/services';
import { LOGIN_COOKIE_STORE_KEY } from 'src/app/shared';

@Injectable()
export class RoleBaseAuthGuard implements CanActivate {

    public userInfo = new LoginInfo();
    public menuJson: Object[];
    public currentUrl; tellerUrl:string;
    public isContinue: boolean;
    constructor(private authService: AuthService, private router: Router, private _appStorageService: AppStorageService) {
        
     }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        this.tellerUrl = state.url.split('/')[1]; 
        if(this.tellerUrl =="disburse-remittance-request"){
            return true
        }
        this.currentUrl = state.url.split('/')[2]; 
        if (this.isAuthenticated()) {
            return true;
        }
        this.router.navigate([PATH.LOGIN]);
        return false;
    }

    isAuthenticated(){
        let userInfo = this._appStorageService.getData(LOGIN_COOKIE_STORE_KEY);
        if (userInfo != null) {
          this.userInfo = <LoginInfo>JSON.parse(userInfo);
        }
        this.menuJson = JSON.parse(this.userInfo.menuJson);
        this.isContinue = true;
        this.menuJson.forEach(ele =>{
            let leftmenuids = ele['leftmenuids'];
            if(this.isContinue){
                for(let i=0; i < leftmenuids.length; i++ ){
                    if(leftmenuids[i].text ==  this.currentUrl){
                        this.isContinue = false;
                        break;
                    }
                }
            }
       })
       if(this.isContinue){
         return false
       }else{
           return true
       }
    }
}
