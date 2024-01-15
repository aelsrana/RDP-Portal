import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Remittance } from 'src/app/shared/model/model/remittance';
import { SearchParams } from 'src/app/shared/model/request/search-param';
import { LazyLoadEvent } from 'primeng/api';
import { MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from 'src/app/shared/guard';
import { MessageService, AppStorageService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { PAGE_SIZE_OPTIONS, PAGE_SIZE } from 'src/app/shared';
import { RemittanceEditService } from 'src/app/dashboard/remittance-edit/remittance-edit.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { GrowlMessageService } from 'src/app/shared/services/growl.message.service';

@Component({
  templateUrl: './remittance-edit.component.html',
  styleUrls: ['./remittance-edit.component.css']
})
export class RemittanceEditComponent implements OnInit {

  displayedColumns = ['select', 'lock', 'remarks', 'senderName', 'pin', 'senderCountry', 'recipientName',  'mobile', 'amount', 'actualAmt', 'lockedBy', 'applicationDate', 'status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Remittance>(this.dataSource);
  selection = new SelectionModel<Remittance>(true, []);
  public pageSize:number;
  private pageNum: number;
  public currentOffset: number;
  public pageSizeOptions = PAGE_SIZE_OPTIONS;
  public totalCount = 0;
  public oids=[];
  public userInfo: any;
  public fromDate; toDate: any;
  public params = new SearchParams();
  @Input() public msgs: Array<any> = [];
  isLoading; showDialog; showRemarks : boolean;
  remarks:string;
  

  constructor(private authService: AuthService, private remittanceService: RemittanceEditService, private messagesService: GrowlMessageService,
    private router : Router, private activatedRoute: ActivatedRoute, private loaderService: LoaderService,
    private _appStorageService: AppStorageService) {
    this.userInfo = this.authService.getAuthInfo();
    this.pageSize= PAGE_SIZE;
  }

  notifyParams(notifyParams){
    this.params = notifyParams;
    this.setPagination();
    this.getRemittanceList();
  }

  refresh(){
      this.setPagination();
      this.getRemittanceList();
      this.selection.clear();
  }

  viewDetail(ele){
    this._appStorageService.setData('pageNum', this.paginator.pageIndex);
    this.router.navigate([ele.oid], {relativeTo: this.activatedRoute})
  }

  /*Start Data Table related function */
  setPagination(){
    this.pageNum = Number(this._appStorageService.getData('pageNum'));
    if(this.pageNum ==0){
        this.currentOffset = Number(this.paginator.pageIndex * this.pageSize);
    }else{
        this.currentOffset = (Number(this._appStorageService.getData('pageNum')) * Number(this.pageSize)) - Number(this.pageSize);
        this.paginator.pageIndex = Number(this._appStorageService.getData('pageNum'));
    }
    this.params.offset = this.currentOffset;
    this.params.limit = Number(this.pageSize);
}


  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  ngOnInit() {
    this.setPagination();
    this.getRemittanceList();
    this._appStorageService.removeData('pageNum')
    
  }

  sortData(sort: Sort) {
    const data = this.dataSource.slice();
    if (!sort.active || sort.direction == '') {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'senderName': return compare(a.senderName, b.senderName, isAsc);
        case 'recipientName': return compare(+a.recipientName, +b.recipientName, isAsc);
        case 'branch': return compare(+a.branchName, +b.branchName, isAsc);
        case 'senderCountry': return compare(+a.senderCountry, +b.senderCountry, isAsc);
        case 'actualAmt': return compare(+a.actualAmountInBdt, +b.actualAmountInBdt, isAsc);
        case 'amount': return compare(+a.amount, +b.amount, isAsc);
        case 'applicationDate': return compare(+a.createdOn, +b.createdOn, isAsc);
        case 'mobile': return compare(+a.recipientMobileNo, +b.recipientMobileNo, isAsc);
        default: return 0;
      }
    });
  }

  pageChange(e){
    this.params.offset = e.pageIndex * e.pageSize;
    this.params.limit = e.pageSize;
    this.pageSize =  e.pageSize;
    this.getRemittanceList();
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows = this.dataSource.filter(ele => {
        return ele.lockedBy ==null
    });
    const numRowsCount = numRows.length;
    return numSelected === numRowsCount;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row =>{
        if(row.lockedBy ==null) {
          this.selection.select(row)
        }
      });
  }
  /*End Data Table related function */

  getRemittanceList() {
    this.isLoading = true;
    if (this.userInfo.branchOid) this.params.branchOid = this.userInfo.branchOid;
    if (this.params.searchText) this.params.searchText = this.params.searchText;
    this.remittanceService.getList(this.params).subscribe(result => {
      this.isLoading = false;
      this.params.searchText = null;
      this.oids=[];
      if (result != null && result.header.responseCode == '200') {
        this.dataSource = result['body']['data'];
        this.totalCount = Number(result['body']['count']);
      } else {
        this.msgs = this.messagesService.showInfo(result.header.responseMessage);
        this.reset();
        setTimeout(() => {
          this.msgs = this.messagesService.clear();
        }, 5000);
      }
    });

  }

  

 lockNew(){
  this.loaderService.display(true);
   this.selection.selected.forEach(row=>{
      this.oids.push(row.oid)
   })
   if(this.oids.length < 1){
    this.showDialog =true;
    return;
  }
 
  this.remittanceService.lockForEditRemittance(this.oids, this.userInfo.loginId).subscribe(result => {
      this.params.searchText = null;
      this.loaderService.display(false);
      if (result != null && result.header.responseCode == '200') {
        this.msgs = this.messagesService.showSuccess(result.header.responseMessage);
        this.refresh();
        setTimeout(() => {
          this.msgs = this.messagesService.clear();
        }, 5000);
      } else {
        this.msgs = this.messagesService.showInfo(result.header.responseMessage);
        setTimeout(() => {
          this.msgs = this.messagesService.clear();
        }, 5000);
      }
    });
  }

  closeDialog(){
    this.showDialog =false;
  }

  closeRemarks(){
    this.showRemarks =false;
  }

  approverRemarks(remarks){
    this.showRemarks =true;
    this.remarks = remarks;
  }

  reset() {
    this.dataSource = [];
    this.paginator.pageIndex=0;
    this.totalCount = 0;
  }

  closeMsg(){
    this.msgs =[];
  }

  goToMyLockList(){
    this.router.navigate(['/dashboard/my-edit-remittance-request'])
  }

}

/* for data table sort */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
