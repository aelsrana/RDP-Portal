import { Component, OnInit, Input } from "@angular/core";
import { routerTransition } from "src/app/router.animations";
import { ActivatedRoute, Params } from "@angular/router";
import { AuthService } from "src/app/shared/guard";
import { MessageService } from 'src/app/shared/services';
import { Location} from "@angular/common";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { RemittanceService } from "src/app/dashboard/remittance-all/remittance.service";
import { Remittance } from "src/app/shared/model/model/remittance";
import { JPG_EXTENTION, IFR_IMAGE_PATH } from "src/app/shared";
import * as moment from 'moment';
import { LoaderService } from "src/app/shared/services/loader.service";

@Component({
    templateUrl: './remittance-detail.component.html',
    styleUrls: ['./remittance.component.css'],
    animations: [routerTransition()]
  })
  
  export class RemittanceDetailComponent implements OnInit {

    public id:string;
    public imgPath: string;
    public userInfo:any;
    public personImgFileName; frontImgFileName; backImgFileName:string;
    public remittanceInfo : Remittance
    public remittanceForm: FormGroup;
    @Input() public msgs: Array<any> = [];
    public customerPhotoModalDialog: boolean = false;
    public frontPhotoModalDialog: boolean = false;
    public backPhotoModalDialog: boolean = false;
    
    constructor(private activatedRoute: ActivatedRoute,  public authService: AuthService, private location: Location,
        private fb: FormBuilder, private remittanceService : RemittanceService, private messagesService: MessageService, private loaderService: LoaderService){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['oid'];
        });
        this.remittanceForm = this.createForm();
        this.imgPath = IFR_IMAGE_PATH;  
        this.userInfo = this.authService.getAuthInfo();
    }

    createForm(){
        return this.fb.group({
            branchName: [null, Validators.required],
            applicationDate: [null], dateOfBirth: [null],
            branchExHouseOid:[null, Validators.required],
            exHouseName: [null], pin: [null],
            ttNumber: [null], senderName: [null],
            senderCountry: [null], recipientName: [null],
            recipientMobileNo: [null],photoIdType: [null],
            photoId: [null], 
            amount: ['', Validators.required],
            actualAmountInBdt: [''],
            remarks: [null], createdOn:[null]
          });
    }

    getByOid() {
        this.loaderService.display(true);
        this.remittanceService.getByOid(this.id).subscribe(result => {
          this.loaderService.display(false);
          if (result != null && result.header.responseCode == '200') {
            this.remittanceInfo = result['body']['data'];
            this.bindRemittanceInfo();
            if(this.remittanceInfo.recipientPhotoPath != undefined){
                this.personImgFileName = this.imgPath + this.remittanceInfo.recipientPhotoPath.slice(this.remittanceInfo.recipientPhotoPath.lastIndexOf("/")+1, this.remittanceInfo.recipientPhotoPath.lastIndexOf(".")) + JPG_EXTENTION;
            }
            if(this.remittanceInfo.photoIdFrontPath != undefined){
                this.frontImgFileName = this.imgPath + this.remittanceInfo.photoIdFrontPath.slice(this.remittanceInfo.photoIdFrontPath.lastIndexOf("/")+1, this.remittanceInfo.photoIdFrontPath.lastIndexOf(".")) + JPG_EXTENTION;
            }
            if(this.remittanceInfo.photoIdBackPath != undefined){
                this.backImgFileName = this.imgPath + this.remittanceInfo.photoIdBackPath.slice(this.remittanceInfo.photoIdBackPath.lastIndexOf("/")+1, this.remittanceInfo.photoIdBackPath.lastIndexOf(".")) + JPG_EXTENTION;
            }
          } else {
            this.msgs = this.messagesService.showInfo(result.header.responseMessage);
            setTimeout(() => {
              this.msgs = this.messagesService.clear();
            }, 3000);
          }
        });
    }

    bindRemittanceInfo(){
        this.remittanceForm.patchValue({
            branchName: this.remittanceInfo.branchName, 
            exHouseName: this.remittanceInfo.exHouseName,
            pin : this.remittanceInfo.pin,
            ttNumber: this.remittanceInfo.ttNumber,
            photoId: this.remittanceInfo.photoId,
            photoIdType: this.remittanceInfo.photoIdType,
            senderName: this.remittanceInfo.senderName,
            senderCountry: this.remittanceInfo.senderCountry,
            recipientName: this.remittanceInfo.recipientName,
            recipientMobileNo: this.remittanceInfo.recipientMobileNo,
            amount : this.remittanceInfo.amount,
            actualAmountInBdt: this.remittanceInfo.actualAmountInBdt,
            dateOfBirth: moment(this.remittanceInfo.dateOfBirth).format('YYYY-MMM-DD')
        })
    }

    goBack(){
        this.location.back();
    }
    
    ngOnInit(): void {
        this.getByOid();
    }

    closeMsg(){
        this.msgs =[];
      }
      
  }