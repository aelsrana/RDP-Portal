import { Component, OnInit, Input, Output } from '@angular/core';
import {Location} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {
    @Input() heading: string;
    @Input() icon: string;
    @Input() details: string;
    @Input() heading_link:string;
    @Input() title:string;
    @Input() active:string;
    @Input() showDashboard:boolean=true;
    constructor(private location : Location) {}

    goBack(){
        this.location.back();
    }
    ngOnInit() {}
}
