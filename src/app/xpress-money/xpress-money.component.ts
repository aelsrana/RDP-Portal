import { Component } from '@angular/core';

@Component({
    selector: 'app-xpress-money',
    templateUrl: './xpress-money.component.html',
    styleUrls: ['./xpress-money.stylesheet.css']
})
export class XpressMoneyComponent {
    public hideLogin: boolean = false;
    public isValidPIN: boolean = false;
    public isSubmitClicked: boolean = false;

    constructor() {

    }

    checkAndShow(value) {
        this.isSubmitClicked = true;
        if (parseInt(value) % 2 === 0) {
            this.isValidPIN = true;
        }
        else {
            this.isValidPIN = false;
        }
    }
}
