import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef } from "@angular/core";
import { routerTransition } from "src/app/router.animations";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SearchParams } from "src/app/shared/model/request/search-param";
import { AuthService } from "src/app/shared/guard";
import { Router } from "@angular/router";
import { ViewEncapsulation, Input } from "@angular/core";
import { Subject } from "rxjs";
import { UtilService } from "src/app/shared/services/util.service";
import { StatusService } from "src/app/shared/services/status.service";
import { debounceTime, map } from 'rxjs/operators';
import { distinctUntilChanged} from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { timer } from 'rxjs/observable/timer';


@Component({
    selector: 'search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css'],
    animations: [routerTransition()],
    encapsulation: ViewEncapsulation.None
  })

  export class SearchPanelComponent implements OnInit {

  
    searchPanel: FormGroup;
    userInfo; selectedBranch; selectedServicePoint:any;
    showCloseBtn; isBranchDisabled:boolean;
    branchList; servicePointList; statusList=[];
    searchText:string;
    params = new SearchParams()
    searchTerm$ = new Subject<string>();
    @Input() showStatus:boolean=true;
    @ViewChild('searchText') input : ElementRef;
    @Output() notifyParams: EventEmitter<any> = new EventEmitter<any>();

    constructor(private fb: FormBuilder, private util : UtilService, private authService: AuthService,
    private statusService: StatusService, private router: Router ){
      this.userInfo = this.authService.getAuthInfo();
      this.selectedBranch = this.userInfo.branchOid;
      if(this.selectedBranch){
        this.params.branchOid = this.selectedBranch;
        this.isBranchDisabled =true;
      }
      this.searchPanel = this.initForm();
      this.getBranchList();
    }

    initForm(){
      return this.fb.group({
        branchId: null,
        servicePointId:null,
        status: null,
        searchText:null
      })
    }

    ngOnInit(): void {
      
    }

    getBranchList() {
      this.util.getBranchList().subscribe(resData => {
          this.getStatusList();
          if (resData['body']['data'] != undefined) {
              this.branchList = resData['body']['data'];
              this.branchList.forEach(element => {
                if(element.branchId==this.userInfo.branchOid){
                  this.searchPanel.patchValue({ branchId : element.branchId })
                }
              });
              
          }
      });
    }
  
    getStatusList() {
      this.statusList = this.statusService.getStatus(this.userInfo.roleId, this.router.url);
    }
    statusValueChange(status){
      this.params.status=status;
      this.notifyParams.emit(this.params);
    }
    branchValueChange(branchId){
      this.params.branchOid = branchId;
      this.notifyParams.emit(this.params);
      
    }

    servicePointValueChange(servicePointId){
      this.params.servicePointOid=servicePointId;
      this.notifyParams.emit(this.params);
    }

    // search(){
    //   const debouncedInput = this.searchPanel.get('searchText').valueChanges
    //   .pipe(debounceTime(500), distinctUntilChanged());
    //    const subscribe = debouncedInput.subscribe(val => {
    //     this.params.searchText=val; 
    //     this.notifyParams.emit(this.params);       
    //   });
     
    // }

    search(searchText) {
      this.params.searchText=searchText;
      this.notifyParams.emit(this.params);
    }
  
    clearSearchText(){
      this.showCloseBtn=false
      this.input.nativeElement.value ='';
      this.notifyParams.emit(this.params);
    }
  }
