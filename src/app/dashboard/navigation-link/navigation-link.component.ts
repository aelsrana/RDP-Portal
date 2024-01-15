import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginInfo } from '../../shared/model/response/loginInfo';
import { AppStorageService, NavigatorService } from '../../shared/services/index';
import { Title } from '@angular/platform-browser';
import { LOGIN_COOKIE_STORE_KEY } from '../../shared/index';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-navigation-link',
    templateUrl: './navigation-link.component.html',
    styleUrls: ['./navigation-link.component.css'],
    animations: [routerTransition()]
})
export class NavigationLinkComponent implements OnInit {
    
    pieChartData: any;
    barChartData: any;
    icon: any;
    leftMenus: Object;
    userInfo = new LoginInfo();
    public menuJson: Object[];
    route: string;
    public isFieldUser: boolean;
    public cellosticsUrl: string;

    constructor(private _appStorageService: AppStorageService, private _router: Router, private navigatorService: NavigatorService,
        private titleService: Title) {
        let userInfo = this._appStorageService.getData(LOGIN_COOKIE_STORE_KEY);
        if (userInfo != null) {
            this.userInfo = <LoginInfo>JSON.parse(userInfo);
        }
        this.menuJson = JSON.parse(this.userInfo.menuJson);
        if(this.userInfo.roleId =="RDP.TELLER" || this.userInfo.roleId =="BRANCH.TELLER"){
            this._router.navigate(['disburse-remittance-request'])
        }
       
        this.pieChartData = {
            labels: ['Disbursed', 'Request Received', 'Cancel'],
            datasets: [
                {
                    data: [188, 75, 18],
                    backgroundColor: [
                        "#37BC9B",
                        "#36A2EB",
                        "#DA4453"
                    ],
                    hoverBackgroundColor: [
                        "#37BC9B",
                        "#36A2EB",
                        "#DA4453"
                    ]
                }]
        };
        this.barChartData = {
            labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Request Disbursed',
                    backgroundColor: '#37BC9B',
                    borderColor: '#37BC9B',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Request Cancel',
                    backgroundColor: '#DA4453',
                    borderColor: '#DA4453',
                    data: [20, 25, 30, 25, 15, 18, 30]
                }
            ]
        }
    }

    goToHomePage() {
        this.navigatorService.goToHomePage();
    }

    ngOnInit() {
       
    }

}
