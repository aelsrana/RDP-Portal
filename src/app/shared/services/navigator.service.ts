import { PATH } from './../constant/path';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class NavigatorService {

    constructor(private _router: Router) {

    }
    goToTop() {
        window.scrollTo(0, 0);
    }
    menuNavigation(navUrl) {
        this.goToTop();
        this._router.navigate(['/' + navUrl]);
    };
    goToHomePage() {
        this.goToTop();
        this._router.navigate([PATH.DASHBOARD]);
    }
}