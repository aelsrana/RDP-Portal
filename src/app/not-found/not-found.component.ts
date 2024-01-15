import { Component, OnInit } from '@angular/core';
import { NavigatorService } from 'src/app/shared/services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  public title:string;
	public hostname;string;
	constructor(private navigatorService: NavigatorService, private titleService: Title) {
		this.title ="PageNotFound";
		this.hostname = window.location.origin;
		// this.titleService.setTitle("Page Not Found");
	}

	goToHomePage(){
		this.navigatorService.goToHomePage();
	}

	ngOnInit() {
	}
}
