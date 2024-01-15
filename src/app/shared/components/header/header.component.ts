import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { LoginInfo } from '../../../shared/model/response/loginInfo';
import { AuthService } from '../../../shared/guard/index';
import { AppStorageService, NavigatorService } from '../../../shared/services/index';
import { LOGIN_COOKIE_STORE_KEY, USER_IMAGE_PATH } from '../../../shared/index';
import { PATH } from '../../../shared/constant/path';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userInfo = new LoginInfo();

  public imgPath: string;
  public userImgFileName:string;
  public route: string;
  public idleState: string;
  pushRightClass: string = 'push-right';

  constructor(private authService: AuthService, private _router: Router,
    private _appStorageService: AppStorageService, private navigatorService : NavigatorService,
    private translate: TranslateService,) {
      this.translate.addLangs(['en', 'bn']);
      this.translate.setDefaultLang('en');
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang.match(/en|bn/) ? browserLang : 'en');

      this._router.events.subscribe(val => {
          if (
              val instanceof NavigationEnd &&
              window.innerWidth <= 992 &&
              this.isToggled()
          ) {
              this.toggleSidebar();
          }
      });
    this.imgPath = USER_IMAGE_PATH;
    let userInfo = this._appStorageService.getData(LOGIN_COOKIE_STORE_KEY);
    if (userInfo != null) {
      this.userInfo = <LoginInfo>JSON.parse(userInfo);
      if(this.userInfo.userPhotoPath !=null && this.userInfo.userPhotoPath != "images/default_avater.jpg"){
         let n = this.userInfo.userPhotoPath.lastIndexOf("/");
         this.userImgFileName = this.imgPath + this.userInfo.userPhotoPath.substring(n+1);
      }else{
         this.userImgFileName = "assets/images/default_avater.jpg";
      }      
    }
  }

  ngOnInit() {
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle(this.pushRightClass);
  }

  changeLang(language: string) {
    this.translate.use(language);
  }
  goToHomePage() : void{
     this.navigatorService.goToHomePage();
  }

  changePassword(){
    this._router.navigate([PATH.CHANGE_PASSWORD]);
  }

  onLoggedout() {
    this.userInfo = new LoginInfo();
    this.authService.logout();
  }

}
