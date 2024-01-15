import { LoaderService } from 'src/app/shared/services/loader.service';
import { Component, OnInit, Input } from "@angular/core";
import { routerTransition } from "src/app/router.animations";
import { ActivatedRoute, Params } from "@angular/router";
import { AuthService } from "src/app/shared/guard";
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, NgModel } from '@angular/forms';
import { IFR_IMAGE_PATH, JPG_EXTENTION } from '../../shared/constant/constant';
import { Location } from '@angular/common';
import { RemittanceMyApproveService } from 'src/app/dashboard/remittance-my-approve/remittance-my-approve.service';
import * as moment from 'moment';
import { GrowlMessageService } from 'src/app/shared/services/growl.message.service';

@Component({
    templateUrl: './remittance-my-approve-detail.component.html',
    styleUrls: ['./remittance-my-approve.component.css'],
    animations: [routerTransition()]
})

export class RemittanceMyApproveDetailComponent implements OnInit {

    public id: string;
    public userInfo: any;
    public personImgFileName: any;
    public frontImgFileName: any;
    public backImgFileName: any;
    public imgPath: string = IFR_IMAGE_PATH;
    @Input() public msgs: Array<any> = [];
    public remittanceForm: FormGroup;

    public rejectConfirmationModal: boolean = false;
    public otherReason: boolean = false;
    public rejectReason: string[] = [];
    public reasonText: string = '';

    public customerPhotoModalDialog: boolean = false;
    public frontPhotoModalDialog: boolean = false;
    public backPhotoModalDialog: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, public authService: AuthService, private fb: FormBuilder, private location: Location,
        private myApproveService: RemittanceMyApproveService, private loaderService: LoaderService, private messageService: GrowlMessageService) {
            this.loaderService.display(true);
            this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['oid'];
            this.myApproveService.getDetailForApprove(this.id)
                .subscribe(resData => {
                    this.loaderService.display(false);
                    if (resData != null && resData.header.responseCode == '200') {
                        this.remittanceForm.patchValue({
                            branchName: resData.body.data.branchName,
                            recipientName: resData.body.data.recipientName,
                            dateOfBirth: moment(resData.body.data.dateOfBirth).format('YYYY-MMM-DD'),
                            recipientMobileNo: resData.body.data.recipientMobileNo,
                            photoIdType: resData.body.data.photoIdType,
                            photoId: resData.body.data.photoId,
                            senderName: resData.body.data.senderName,
                            senderCountry: resData.body.data.senderCountry,
                            pin: resData.body.data.pin,
                            exHouseName: resData.body.data.exHouseName,
                            amount: resData.body.data.amount,
                            actualAmountInBdt: resData.body.data.actualAmountInBdt
                        });
                        this.personImgFileName = this.imgPath + resData.body.data.recipientPhotoPath.slice(resData.body.data.recipientPhotoPath.lastIndexOf("/") + 1, resData.body.data.recipientPhotoPath.lastIndexOf(".")) + JPG_EXTENTION;
                        this.frontImgFileName = this.imgPath + resData.body.data.photoIdFrontPath.slice(resData.body.data.photoIdFrontPath.lastIndexOf("/") + 1, resData.body.data.photoIdFrontPath.lastIndexOf(".")) + JPG_EXTENTION;
                        this.backImgFileName = this.imgPath + resData.body.data.photoIdBackPath.slice(resData.body.data.photoIdBackPath.lastIndexOf("/") + 1, resData.body.data.photoIdBackPath.lastIndexOf(".")) + JPG_EXTENTION;
                    }

                }, err => {

                });
        });
        this.userInfo = this.authService.getAuthInfo();
    }

    ngOnInit() {
        this.remittanceForm = this.fb.group({
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
    OnApproveClick() {
        this.loaderService.display(true);
        this.myApproveService.approveRequest(this.id)
            .subscribe(resData => {
                this.loaderService.display(false);
                if (resData != null && resData.header.responseCode == '200') {
                    this.msgs = this.messageService.showSuccess(resData.header.responseMessage);
                }else{
                    this.msgs = this.messageService.showError(resData.header.responseMessage);
                }
                setTimeout(() => {
                    this.msgs = this.messageService.clear();
                    this.goBack();
                }, 5000);
            });
    }
    OnCancelClick() {
        this.location.back();
    }
    goBack() {
        this.location.back();
    }

    OnRejectClick() {
        this.rejectConfirmationModal = true;
    }
    onRejectYesClick() {
        this.rejectConfirmationModal = false;
        this.loaderService.display(true);
        let rejectionCause;
        rejectionCause = this.reasonText;
        if (this.rejectReason.length > 0) {
            for (var i = 0; i < this.rejectReason.length; i++) {
                rejectionCause += ' ' + this.rejectReason[i];
            }
        }
        this.myApproveService.requestReject(this.id, rejectionCause)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.loaderService.display(false);
                    this.msgs = this.messageService.showSuccess(resData.header.responseMessage);
                    this.location.back();
                }
                else {
                    this.loaderService.display(false);
                    this.msgs = this.messageService.showInfo(resData.header.responseMessage);
                }
            },
            err => {
                this.loaderService.display(false);
                console.log(err);
            });
    }
    onRejectNoClick() {
        this.rejectConfirmationModal = false;
    }
}