import { Component,  OnInit,  ChangeDetectorRef,  AfterViewChecked, DoCheck } from '@angular/core';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {

  isLoadingSpinner = true;
  isLoading = true;
  constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.isLoadingSpinner = val;
      this.isLoading = val;
    });
  }

  ngDoCheck(): void {
    this.cdRef.detectChanges();
  }
}
