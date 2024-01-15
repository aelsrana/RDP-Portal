import { JPG_EXTENTION } from 'src/app/shared';
import { IFR_IMAGE_PATH } from 'src/app/shared';
import { Person } from './../../shared/model/model/person';
import { RemittanceCardService } from './remittance-card.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SearchParams } from 'src/app/shared/model/request/search-param';
import { LazyLoadEvent } from 'primeng/api';
import { MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from 'src/app/shared/guard';
import { MessageService, AppStorageService } from 'src/app/shared/services';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { PAGE_SIZE_OPTIONS, PAGE_SIZE } from 'src/app/shared';
import { GrowlMessageService } from 'src/app/shared/services/growl.message.service';

@Component({
  templateUrl: './remittance-card.component.html',
  styleUrls: ['./remittance-card.component.css']
})
export class RemittanceCardComponent implements OnInit {

  displayedColumns = ['index', 'photo', 'name', 'photoIdType', 'photoId',  'mobile', 'email', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Person>(this.dataSource);
  selection = new SelectionModel<Person>(true, []);
  public pageSize:number;
  private pageNum; serial: number;
  public currentOffset: number;
  public pageSizeOptions = PAGE_SIZE_OPTIONS;
  public totalCount = 0;
  public oids=[];
  public userInfo: any;
  public fromDate; toDate: any;
  public params = new SearchParams();
  @Input() public msgs: Array<any> = [];
  public isLoading; customerPhotoModalDialog: boolean;
  public personImagePath; customerPhoto:string;
  

  constructor(private authService: AuthService, private remittanceService: RemittanceCardService, private messagesService: GrowlMessageService,
    private router : Router, private activatedRoute: ActivatedRoute, private loaderService: LoaderService,
    private _appStorageService: AppStorageService) {
    this.userInfo = this.authService.getAuthInfo();
    this.pageSize= PAGE_SIZE;
  }

  notifyParams(notifyParams){
    debugger
    this.params = notifyParams;
    if(this.params.searchText!=undefined){
      this.setPagination();
      this.getPersonList();
    }
    
  }

  refresh(){
      this.setPagination();
      this.getPersonList();
  }

  viewDetail(ele){
    let personInfo = {'fullName': ele.fullName, 'photoPath': ele.photoPath, 'email': ele.email}
    this._appStorageService.setData('personInfo', JSON.stringify(personInfo));
    this._appStorageService.setData('pageNum', this.paginator.pageIndex);
    this.router.navigate([ ele.oid],  {relativeTo: this.activatedRoute})
  }

  showPhoto(photoPath){
    let modal = document.getElementById('customerPhotoModal');
    modal.style.display = "block"; 
    var captionText = document.getElementById("caption");
    captionText.innerText ="Customer Photo"
    // this.customerPhotoModalDialog =true;
    this.customerPhoto=photoPath;
  }

  close(){
    let modal = document.getElementById('customerPhotoModal');
    modal.style.display = "none"; 
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
    this.getPersonList();
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
        case 'name': return compare(a.name, b.name, isAsc);
        case 'mobile': return compare(+a.mobile, +b.mobile, isAsc);
        case 'photoId': return compare(+a.photoId, +b.photoId, isAsc);
        case 'photoIdType': return compare(+a.photoIdType, +b.photoIdType, isAsc);
        case 'email': return compare(+a.email, +b.email, isAsc);
        default: return 0;
      }
    });
  }

  pageChange(e){
    this.params.offset = e.pageIndex * e.pageSize;
    this.params.limit = e.pageSize;
    this.pageSize =  e.pageSize;
    this.getPersonList();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row =>{
        this.selection.select(row)
      });
  }
  /*End Data Table related function */

  getPersonList() {
    this.isLoading = true;
    if (this.params.searchText) this.params.searchText = this.params.searchText;
    this.remittanceService.getList(this.params).subscribe(result => {
      this.isLoading = false;
      this.params.searchText = null;
      if (result != null && result.header.responseCode == '200') {
        this.dataSource = result['body']['data'];
        this.totalCount = Number(result['body']['count']);
        if(this.dataSource){
          this.dataSource.forEach(ele => {
            ele.photoPath = IFR_IMAGE_PATH + ele.photoPath.slice(ele.photoPath.lastIndexOf("/")+1, ele.photoPath.lastIndexOf(".")) + JPG_EXTENTION;
            if(ele.mobileNoList){
              for (var index = 0; index < ele.mobileNoList.length; index++) {
                if(ele.mobileNoList[index].isMobileNoVerified=='Yes'){
                  ele.mobileNo= ele.mobileNoList[index].mobileNo;
                  break;
                }else{
                  ele.mobileNo= ele.mobileNoList[index].mobileNo;
                }
              }
            }
            if(ele.photoIdList){
              for (var i = 0; i < ele.photoIdList.length; i++) {
                if(ele.photoIdList[i].photoIdType=='NID' || ele.photoIdList[i].photoIdType=='SmartNID'){
                  ele.photoIdType= ele.photoIdList[i].photoIdType;
                  ele.photoIdNo= ele.photoIdList[i].photoIdNo;
                  break;
                }else{
                  ele.photoIdType= ele.photoIdList[i].photoIdType;
                  ele.photoIdNo= ele.photoIdList[i].photoIdNo;
                }
              }
            }
          })
        }
        this.serial = ( this.paginator.pageIndex * this.pageSize);
        console.log(this.dataSource)
      } else {
        this.msgs = this.messagesService.showInfo(result.header.responseMessage);
        this.reset();
        setTimeout(() => {
          this.msgs = this.messagesService.clear();
        }, 3000);
      }
    });

  }

  reset() {
    this.dataSource = [];
    this.paginator.pageIndex=0;
    this.totalCount = 0;
  }

  closeMsg(){
    this.msgs =[];
  }

}

/* for data table sort */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
