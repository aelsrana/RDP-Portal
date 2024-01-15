import { ActivatedRoute, Params } from "@angular/router";
import { AuthService } from "src/app/shared/guard";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, NgModel } from '@angular/forms';
import { SelectItem, Message } from 'primeng/api';
import { routerTransition } from '../../router.animations';
import { RemittanceMyEditDetailService } from './remittance-my-edit-detail.service';
import { IFR_IMAGE_PATH, JPG_EXTENTION } from '../../shared/constant/constant';
import { ConfirmationService } from 'primeng/api';
import { Location } from '@angular/common';
import { ISocialMediaJson, IMobile, IPhotoId, ISender, ISPermanentAddress, IRecipientDetails, IRemittanceInformation, ISenderDetails, IRemittanceEditInformation, IFingerprintData } from '../bsr-information/bsr-information.interface';

declare var $: any;

@Component({
    templateUrl: './remittance-my-edit-detail.component.html',
    styleUrls: ['./remittance-my-edit-detail.component.css'],
    animations: [routerTransition()]
})
export class RemittanceMyEditDetailComponent implements OnInit {

    public id: string = null;
    public userInfo: any = null;
    private remittanceRequestDetails: any;
    /*------------  -------------*/
    @ViewChild('appSearchRecipient') appSearchRecipient: any;
    private isNewPerson: boolean = true;

    public amount: number = null;

    public showPhotoDiv: boolean = false;
    public showSenderDiv: boolean = false;
    public showMobileModal: boolean = false;
    public showSendOTPModal: boolean = false;
    public showVerifyOTPModal: boolean = false;

    public senderAddBtnDisable: boolean = true;
    public capAddBtnDisable: boolean = false;

    public hideSearchDiv: boolean = false;
    public hideBeneficiaryDiv: boolean = true;
    public hideCaptureDiv: boolean = false;
    public hideSenderDiv: boolean = true;
    public hideRemittanceDiv: boolean = true;

    /*---------------------------------------IFR Submit-----------------------------*/
    private newPerson: string = '';
    private isNewSender: string = '';
    private isSenderDetailUpdate: string = '';
    private isRecipientDetailUpdate: string = 'Yes';
    private remittanceInformation: IRemittanceEditInformation;
    private senderDetails: ISenderDetails;
    private recipientDetails: IRecipientDetails;
    private personOid: string = '';
    private senderOid: string = '';
    private fingerPrintData: IFingerprintData;

    /*------------ Beneficiary: Mobile Modal -------------*/
    @ViewChild('bConfirmMobileNumberNgModel') bConfirmMobileNumberNgModel: NgModel;
    @ViewChild('bOTPCodeNgModel') bOTPNgModel: NgModel;
    public bMobileNumber: string = '';
    public bConfirmMobileNumber: string = '';
    public bOTPCode: string = '';
    public mobileValidSign: boolean = false;
    public confirmMobileValidSign: boolean = false;
    public bMobileList: IMobile[] = [];
    public isBMobileSelected: boolean = false;
    public sendOTPByServer: string = '';
    public selectedBMobile: IMobile = null;

    /*------------ Beneficiary: Gender Types -------------*/
    public genderTypes: SelectItem[] = [
        { label: '', value: 'Male', icon: 'fa fa-fw fa-male' },
        { label: '', value: 'Female', icon: 'fa fa-fw fa-female' },
        { label: '', value: 'Other', icon: 'fa fa-fw fa-genderless' }
    ];

    /*------------ Beneficiary: Social Media -------------*/
    private isNewRecipientSocialMedia: string = '';
    public bSocialMediaFlag: boolean = false;
    public bSocialMediaModal: boolean = false;
    public bFacebookId: string = '';
    public bEmail: string = '';
    public bInternet: boolean = false;
    public bImo: boolean = false;
    public bViber: boolean = false;
    public bWhatsapp: boolean = false;
    public bSmartPhone: boolean = false;

    /*------------ Beneficiary: GEO Code -------------*/
    public bDivisionLists: any[] = [];
    public bDistrictLists: any[] = [];
    public bUpazillaLists: any[] = [];
    public bUnionLists: any[] = [];

    /*------------ Beneficiary: Finger Scan -------------*/
    public fingerScanFlag: boolean = false;
    public showFingerScanModal: boolean = false;
    private ws: any;

    defaultFP: string = "";
    private rt: string = "";
    private ri: string = "";
    private lt: string = "";
    private li: string = "";

    private lm: string = "FINGER_NOT_PRESENT";
    private lp: string = "FINGER_NOT_PRESENT";
    private lr: string = "FINGER_NOT_PRESENT";
    private rm: string = "FINGER_NOT_PRESENT";
    private rp: string = "FINGER_NOT_PRESENT";
    private rr: string = "FINGER_NOT_PRESENT";

    public rtFpDiv: boolean = true;
    public rtVarify: boolean = false;
    public rtScan: boolean = true;
    public rtFpNot: boolean = false;

    public riFpDiv: boolean = false;
    public riScan: boolean = true;
    public riFpNot: boolean = false;
    public riVarify: boolean = false;


    public ltFpDiv: boolean = false;
    public ltScan: boolean = true;
    public ltFpNot: boolean = false;
    public ltVarify: boolean = false;

    public liFpDiv: boolean = false;
    public liScan: boolean = true;
    public liFpNot: boolean = false;
    public liVarify: boolean = false;


    public rtFpCanvas: boolean = false;
    public riFpCanvas: boolean = false;
    public ltFpCanvas: boolean = false;
    public liFpCanvas: boolean = false;

    public libtnDisable: boolean = false;

    public isEnbleRtScanBtn: boolean = true;
    public isEnbleRiScanBtn: boolean = true;
    public isEnbleLtScanBtn: boolean = true;
    public isEnbleLiScanBtn: boolean = true;
    public isEnbleLiVerifyBtn: boolean = false;

    public rtFpScanBtnCLick: boolean = false;
    public riFpScanBtnCLick: boolean = false;
    public ltFpScanBtnCLick: boolean = false;
    public liFpScanBtnCLick: boolean = false;

    /*------------ Sender -------------*/
    public senderList: any[] = [];
    public senderListForInsertUpdate: ISender[] = [];
    public selectedSender: any = null;
    public showSenderList: boolean = false;
    public showInputSenderName: boolean = false;
    public showInputSenderControls: boolean = false;
    public isDisableSenderControl: boolean = true;
    public showSenderMendatoryDiv: boolean = false;
    public isSenderEditMode: boolean = false;
    public isSenderSelected: boolean = false;
    public editSenderId: string = '';
    public showSenderAddBtn: boolean = true;

    /*------------ Sender: Social Media -------------*/
    private isNewSenderSocialMedia: string = '';
    public sSocialMediaFlag: boolean = false;
    public sSocialMediaModal: boolean = false;
    public sFacebookId: string = '';
    public sEmail: string = '';
    public sInternet: boolean = false;
    public sImo: boolean = false;
    public sViber: boolean = false;
    public sWhatsapp: boolean = false;
    public sSmartPhone: boolean = false;

    /*------------ Sender: GEO Code -------------*/
    public sDivisionLists: any[] = [];
    public sDistrictLists: any[] = [];
    public sUpazillaLists: any[] = [];
    public sUnionLists: any[] = [];

    /*------------ Remittance -------------*/
    public allExchangeHouseLists: any[] = [];
    public filteredExchangeHouseLists: any[] = [];
    public pinNumber: string = '';
    public tTNumber: string = '';
    public selectedexchangeHouse: string = '';
    public disableTTNumber: boolean = true;


    /*------------ Form Group -------------*/
    public beneficiaryFormGroup: FormGroup;
    public capturePhotoFormGroup: FormGroup;
    public senderFormGroup: FormGroup;

    /*-------------- Photo Div ----------------*/
    @ViewChild('verifyAmountNgModel') verifyAmountNgModel: NgModel;
    public photoIdNoNgModel: NgModel;
    @ViewChild('photoIdNoNgModel') set content(content: NgModel) {
        this.photoIdNoNgModel = content;
        this.cdr.detectChanges();
    }
    public showPhotoAddBtn: boolean = true;
    public showPhotoIdEditBtn: boolean = true;
    public showPhotoDivClrDoneClearBtn: boolean = true;
    public viewSeletedPhotoIdDiv: boolean = false;
    public selectedPhotoId: string = '';
    public photoIdNo: string = '';
    public seletedPhotoIdText: string = 'Photo ID';
    public imgPath: string = IFR_IMAGE_PATH;

    public photoIdTypes: any[] = [{ 'value': '', 'text': 'Choose ID' },
    { 'value': 'SmartNID', 'text': 'Smart NID' },
    { 'value': 'NID', 'text': 'NID' },
    { 'value': 'PassportNo', 'text': 'Passport No.' },
    { 'value': 'DrivingLicense', 'text': 'Driving License' }];

    public photoIdPattern: string = '';
    public photoIdNoTooltip: string = '';
    public photoIdMaxLength: number = 0;

    /*------------ Customer Photo -------------*/
    public photoIdList: any[] = [];
    public photoIdListForInsertUpdate: IPhotoId[] = [];
    public selectedCapturedPhotoId: any = null;
    public isPhotoIdSelected: boolean = false;
    public userPhotoDialog: boolean = false;
    public userPhotoCapture: boolean = false;
    public userPhoto: string = '';
    public customerPhotoModalDialog: boolean = false;
    public showUserPhotoUploadBtn: boolean = true;
    public isUserPhotoAvailable: boolean = false;
    public isPhotoIdInEditMode: boolean = false;
    public photoIdInViewMode: boolean = true;

    /*------------ Photo Id Front -------------*/
    public photoIdFrontDialog: boolean = false;
    public photoIdFrontPhotoCapture: boolean = false;
    public photoIdFrontPhoto: string = '';
    public frontPhotoModalDialog: boolean = false;
    public showPhotoIdCaptureUploadBtn: boolean = true;

    /*------------ Photo Id Back -------------*/
    public photoIdBackDialog: boolean = false;
    public photoIdBackPhotoCapture: boolean = false;
    public photoIdBackPhoto: string = '';
    public backPhotoModalDialog: boolean = false;

    /*------------ Message -------------*/
    public growlMessage: Message[] = [];

    /*------------ IFR -------------*/
    public hideIFRRequestDiv: boolean = false;
    public hideIFRReviewDiv: boolean = true;
    public showMatchBtn: boolean = false;
    public showSubmitBtn: boolean = false;
    public showCancelBtn: boolean = false;
    public showMatchAmountControl: boolean = false;
    public inputAmount: number = null;
    public verifyAmount: number = null;
    public printBtnText: string = "Print";
    public personNIDVerification: string = 'Unverified';
    public remittanceNIDVerification: string = 'Unverified';

    constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private bsrInformationService: RemittanceMyEditDetailService, private confirmationService: ConfirmationService,
        private location: Location, private activatedRoute: ActivatedRoute, private authService: AuthService) {

    }
    ngOnInit() {
        this.beneficiaryFormGroup = this.fb.group({
            bName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.pattern(/^[a-z .-]+$/i)])],
            bDateOfBirth: ['', Validators.required],
            bGenderType: ['', Validators.required],
            bDivision: [''],
            bDistrict: [''],
            bUpazilla: [''],
            bUnion: [''],
            bPresentAddress: ['', Validators.maxLength(100)],
            bPermanentAddress: ['', Validators.maxLength(100)]
        });
        this.senderFormGroup = this.fb.group({
            sName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.pattern(/^[a-z .-]+$/i)])],
            sCountry: ['', Validators.required],
            sCity: [''],
            sMobile: [''],
            sGenderType: [''],
            sDivision: [''],
            sDistrict: [''],
            sUpazilla: [''],
            sUnion: [''],
            sPermanentAddress: ['', Validators.maxLength(100)]
        });
        this.showPhotoAddBtn = false;
        this.showSenderAddBtn = false;
        this.showPhotoIdEditBtn = false;
        //---------------------------------------------
        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['oid'];
            this.bsrInformationService.getDetailForEdit(this.id)
                .subscribe(resData => {
                    if (resData != null && resData.header.responseCode == '200') {
                        this.remittanceRequestDetails = resData.body;
                        this.onBeneficiarySelect(this.remittanceRequestDetails);
                    }
                    else {

                    }

                }, err => {
                    this.growlMessage = [];
                    this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load data' });
                },
                () => {
                    this.bsrInformationService.getExchangeHouseList()
                        .subscribe(resData => {
                            if (resData != null && resData.header.responseCode == '200') {
                                this.allExchangeHouseLists = resData.body.data;
                                this.filteredExchangeHouseLists = this.allExchangeHouseLists;
                                this.selectedexchangeHouse = this.remittanceRequestDetails.remittanceDeatils.exhouseOid;
                            }
                        }, err => {
                            this.growlMessage = [];
                            this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load exchange house list' });
                        });

                    this.bsrInformationService.getDivisionList()
                        .subscribe(resData => {
                            if (resData != null && resData.header.responseCode == '200') {
                                this.bDivisionLists = resData.body.data;
                                this.sDivisionLists = resData.body.data;
                                let presentAddress = this.remittanceRequestDetails.personDetails.presentAddress;
                                if (presentAddress && presentAddress.divisionGeocode !== '') {
                                    this.beneficiaryFormGroup.patchValue({ bDivision: presentAddress.divisionGeocode });
                                }
                                else {
                                    this.beneficiaryFormGroup.patchValue({ bDivision: '' });
                                }
                                if (presentAddress && presentAddress.divisionGeocode !== '' && presentAddress.districtGeocode !== '') {
                                    this.setSelectedDistrict(presentAddress.divisionGeocode, presentAddress.districtGeocode);
                                }
                                if (presentAddress && presentAddress.districtGeocode !== '' && presentAddress.upazillaGeocode !== '') {
                                    this.setSelectedUpazilla(presentAddress.districtGeocode, presentAddress.upazillaGeocode);
                                }
                                if (presentAddress && presentAddress.districtGeocode !== '' && presentAddress.upazillaGeocode !== '' && presentAddress.unionGeocode !== '') {
                                    this.setSelectedUnion(presentAddress.districtGeocode, presentAddress.upazillaGeocode, presentAddress.unionGeocode);
                                }
                            }
                            else {
                                this.bDivisionLists = [];
                                this.beneficiaryFormGroup.patchValue({ bDivision: '' });
                                this.sDivisionLists = [];
                                this.senderFormGroup.patchValue({ sDivision: '' });
                                this.growlMessage = [];
                                this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load division data' });
                            }
                        }, err => {
                            this.growlMessage = [];
                            this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load division data' });
                        });
                });
        });
        this.userInfo = this.authService.getAuthInfo();
        this.disableSenderControls();
    }
    onBeneficiarySelect($event) {
        this.isNewPerson = false;
        this.hideSearchDiv = true;
        this.personOid = $event.personOid;
        // Beneficiary Data Set
        this.beneficiaryFormGroup.setValue({
            bName: $event.personDetails.fullName,
            bDateOfBirth: this.getFormattedDOB($event.personDetails.dateOfBirth),
            bGenderType: $event.personDetails.gender,
            bDivision: "",
            bDistrict: "",
            bUpazilla: "",
            bUnion: "",
            bPresentAddress: $event.personDetails.addressLine1 || "",
            bPermanentAddress: $event.personDetails.addressLine2 || ""
        });

        if ($event.personDetails.mobileNoList.length > 0) {
            this.bMobileList = $event.personDetails.mobileNoList;
            if (this.bMobileList.length === 1) {
                this.selectedBMobile = this.bMobileList[0];
                this.isBMobileSelected = true;
            }
        }
        this.hideBeneficiaryDiv = false;
        if ($event.senderList.length > 0) {
            this.senderList = $event.senderList;
            this.showSenderList = true;
            this.showSenderDiv = true;
            this.hideSenderDiv = false;
            this.showSenderMendatoryDiv = true;
            if (this.senderList.length === 1) {
                this.selectedSender = this.senderList[0];
                let e = { data: this.selectedSender };
                this.onSNameRowSelect(e);
            }
        }

        // Beneficiary: Social Media data set
        if ($event.personDetails.socialMediaFlag == "Yes") {
            this.bSocialMediaFlag = true;
            this.isNewRecipientSocialMedia = 'No';
            this.bFacebookId = $event.personDetails.socialMediaJson.facebook;
            this.bImo = $event.personDetails.socialMediaJson.imo === "Yes" ? true : false;
            this.bInternet = $event.personDetails.socialMediaJson.internetUser === "Yes" ? true : false;
            this.bSmartPhone = $event.personDetails.socialMediaJson.smartphoneUser === "Yes" ? true : false;
            this.bViber = $event.personDetails.socialMediaJson.viber === "Yes" ? true : false;
            this.bWhatsapp = $event.personDetails.socialMediaJson.whatsapp === "Yes" ? true : false;
        }

        // Capture Photo Data Set   
        if ($event.personDetails.photoPath) {
            this.userPhotoCapture = true;
            let beneficiaryPhoto = $event.personDetails.photoPath;
            this.userPhoto = this.imgPath + beneficiaryPhoto.slice(beneficiaryPhoto.lastIndexOf("/") + 1, beneficiaryPhoto.lastIndexOf(".")) + JPG_EXTENTION;
            this.isUserPhotoAvailable = true;
            this.showUserPhotoUploadBtn = false;
        }
        if ($event.personDetails.photoIdList.length > 0) {
            this.viewSeletedPhotoIdDiv = true;
            this.showPhotoDiv = true;
            this.showPhotoDivClrDoneClearBtn = false;
            this.showPhotoIdCaptureUploadBtn = false;
            this.photoIdList = $event.personDetails.photoIdList;
            if (this.photoIdList.length === 1) {
                this.selectedCapturedPhotoId = this.photoIdList[0];
                let e = { data: this.selectedCapturedPhotoId };
                this.onPhotoIdRowSelect(e);
            }
        }
        this.pinNumber = this.remittanceRequestDetails.remittanceDeatils.pin;
        this.tTNumber = this.remittanceRequestDetails.remittanceDeatils.ttNumber;
        this.amount = this.remittanceRequestDetails.remittanceDeatils.amount;

        // Sender: Social Media data set

    }

    /********************************************** Beneficiary **********************************************/

    /*---------------------- Beneficiary: Mobile-----------------------*/
    getFormattedDOB(date): string {
        let d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    }
    addNewMobileNo() {
        this.bMobileNumber = "";
        this.bConfirmMobileNumber = "";
        this.mobileValidSign = false;
        this.confirmMobileValidSign = false;

        this.showMobileModal = true;

        setTimeout(() => $("#bMobileNumber").focus(), 0);
    }
    checkMobileNo() {
        var reg = new RegExp("[0][1][5-9][0-9]{8,8}");
        if (!reg.test(this.bConfirmMobileNumber) || this.bConfirmMobileNumber !== this.bMobileNumber) {
            this.bConfirmMobileNumberNgModel.control.setErrors({ 'incorrect': true });
            this.confirmMobileValidSign = false;
        } else {
            this.bConfirmMobileNumberNgModel.control.setErrors(null);
            this.confirmMobileValidSign = true;
        }
    }
    checkValidMobileNo(inputMobile) {
        var reg = new RegExp("[0][1][5-9][0-9]{8,8}");
        if (reg.test(inputMobile)) {
            this.mobileValidSign = true;
        }
        else {
            this.mobileValidSign = false;
        }
    }
    checkOTP(inputOTP) {
        if (this.sendOTPByServer !== inputOTP) {
            this.bOTPNgModel.control.setErrors({ 'incorrect': true });
        }
        else {
            this.bOTPNgModel.control.setErrors(null);
        }
    }
    onConfirmClick() {
        this.showMobileModal = false;
        this.showSendOTPModal = true;
    }
    onOTPSkipClick() {
        this.showSendOTPModal = false;
        this.showVerifyOTPModal = false;
        //let existedVarifiedMobileNumber = this.bMobileList.filter(x => x.mobileNo === this.bMobileNumber && x.isMobileNoVerified === "Yes");
        //let existedNotVarifiedMobileNumber = this.bMobileList.filter(x => x.mobileNo === this.bMobileNumber && x.isMobileNoVerified === "No");
        let existedNotVarifiedMobileNumber = this.bMobileList.filter(x => x.mobileNo === this.bMobileNumber);
        //if (existedVarifiedMobileNumber.length === 0) {
        if (existedNotVarifiedMobileNumber.length > 0) {
            this.bMobileList.splice(this.bMobileList.indexOf(existedNotVarifiedMobileNumber[0]), 1);
        }
        let bMobile = { mobileNo: this.bMobileNumber, isMobileNoVerified: "No" };
        this.bMobileList.unshift(bMobile);
        this.selectedBMobile = bMobile;
        this.isBMobileSelected = true;
        //}
        //else {
        //    this.growlMessage = [];
        //    this.growlMessage.push({ severity: 'info', summary: '', detail: 'This number is varified and already in beneficiary mobile' });
        //}
    }
    onOTPSendClick() {
        this.showSendOTPModal = false;
        this.showVerifyOTPModal = true;
        this.bsrInformationService.sendOTP(this.bMobileNumber)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.sendOTPByServer = resData.body.otp;
                }
            }, err => {
                this.growlMessage = [];
                this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load union data' });
            });
    }
    onOTPResendClick() {
        this.bsrInformationService.sendOTP(this.bMobileNumber)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.sendOTPByServer = resData.body.otp;
                }
            }, err => {
                this.growlMessage = [];
                this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load union data' });
            });
    }
    onOTPVerifyClick() {
        this.showVerifyOTPModal = false;
        let existedMobileNumber = this.bMobileList.filter(x => x.mobileNo === this.bMobileNumber);
        if (existedMobileNumber.length > 0) {
            this.bMobileList.splice(this.bMobileList.indexOf(existedMobileNumber[0]), 1);
        }
        let bMobile = { mobileNo: this.bMobileNumber, isMobileNoVerified: "Yes" };
        this.bMobileList.unshift(bMobile);
        this.selectedBMobile = bMobile;
        this.isBMobileSelected = true;
    }
    onBMobileRowSelect($event) {
        this.isBMobileSelected = true;
    }
    onBMobileRowUnselect($event) {
        this.isBMobileSelected = false;
    }
    onVerifyOTPModalHide() {
        this.bOTPCode = "";
    }
    /*---------------------- Beneficiary: Social Media -----------------------*/
    addBeneSocialMediaInfo() {
        this.bSocialMediaModal = true;
    }
    onBeneSocialDoneClick() {
        this.bSocialMediaFlag = true;
        this.bSocialMediaModal = false;
        if (this.isNewRecipientSocialMedia !== 'No') {
            this.isNewRecipientSocialMedia = 'Yes';
        }
    }
    /*---------------------- Beneficiary: GEO Code -----------------------*/
    bDivisionSelectionChange() {
        this.bUpazillaLists = [];
        this.bUnionLists = [];

        this.bsrInformationService.getDistrictList(this.beneficiaryFormGroup.get('bDivision').value)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.bDistrictLists = resData.body.data;
                    this.getBSelectedDivisionName(this.beneficiaryFormGroup.get('bDivision').value);
                    //this.bsrInformationService.getThanaList(this.bDistrictLists[0].districtCode)
                    //    .subscribe(resData => {
                    //        if (resData != null && resData.header.responseCode == '200') {
                    //            this.bUpazillaLists = resData.body.data;
                    //            this.beneficiaryFormGroup.patchValue({ bUpazilla: this.bUpazillaLists[0].upazillaCode });
                    //            this.bsrInformationService.getUnionList(this.bDistrictLists[0].districtCode, this.bUpazillaLists[0].upazillaCode)
                    //                .subscribe(resData => {
                    //                    if (resData != null && resData.header.responseCode == '200') {
                    //                        this.bUnionLists = resData.body.data;
                    //                        this.beneficiaryFormGroup.patchValue({ bUnion: this.bUnionLists[0].unionCode });
                    //                    }
                    //                    else {
                    //                        this.bUnionLists = [];
                    //                    }
                    //                }, err => {
                    //                    this.growlMessage = [];
                    //                    this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load union data' });
                    //                });
                    //        }
                    //        else {
                    //            this.bUpazillaLists = [];
                    //        }
                    //    }, err => {
                    //        this.growlMessage = [];
                    //        this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load upazilla data' });
                    //    });
                }
                else {
                    this.beneficiaryFormGroup.patchValue({ bDivision: '' });
                    console.log("error");
                }
            });
    }
    setSelectedDistrict(selectedDivision: string, selectedDistrictCode: string) {
        this.bUpazillaLists = [];
        this.bUnionLists = [];
        this.bsrInformationService.getDistrictList(selectedDivision)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.bDistrictLists = resData.body.data;
                    this.beneficiaryFormGroup.patchValue({ bDistrict: selectedDistrictCode });
                }
                else {
                    console.log("error");
                }
            });
    }
    getBSelectedDivisionName(divisionCode) {
        return this.bDivisionLists.filter(a => a.divisionCode == divisionCode)[0].divisionName;
    }

    bDistrictSelectionChange() {
        this.bUpazillaLists = [];
        this.bUnionLists = [];
        this.bsrInformationService.getThanaList(this.beneficiaryFormGroup.get('bDistrict').value)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.bUpazillaLists = resData.body.data;
                    //this.beneficiaryFormGroup.patchValue({ bUpazilla: this.bUpazillaLists[0].upazillaCode });
                    //this.bsrInformationService.getUnionList(this.beneficiaryFormGroup.get('bDistrict').value, this.bUpazillaLists[0].upazillaCode)
                    //    .subscribe(resData => {
                    //        if (resData != null && resData.header.responseCode == '200') {
                    //            this.bUnionLists = resData.body.data;
                    //            this.beneficiaryFormGroup.patchValue({ bUnion: this.bUnionLists[0].unionCode });
                    //        }
                    //        else {
                    //            this.bUnionLists = [];
                    //        }
                    //    }, err => {
                    //        this.growlMessage = [];
                    //        this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load union data' });
                    //    });
                }
                else {
                    console.log("error");
                }
            });
    }
    getBSelectedDistrictName(districtCode) {
        return this.bDistrictLists.filter(a => a.districtCode == districtCode)[0].districtName;
    }

    setSelectedUpazilla(selectedDistrictCode: string, selectedUpazilla: string) {
        this.bUpazillaLists = [];
        this.bUnionLists = [];
        this.bsrInformationService.getThanaList(selectedDistrictCode)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.bUpazillaLists = resData.body.data;
                    this.beneficiaryFormGroup.patchValue({ bUpazilla: selectedUpazilla });
                }
                else {
                    console.log("error");
                }
            });
    }
    bUpazillaSelectionChange() {
        this.bUnionLists = [];
        this.bsrInformationService.getUnionList(this.beneficiaryFormGroup.get('bDistrict').value, this.beneficiaryFormGroup.get('bUpazilla').value)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.bUnionLists = resData.body.data;
                    //this.beneficiaryFormGroup.patchValue({ bUnion: this.bUnionLists[0].unionCode });
                }
                else {
                    console.log("error");
                }
            });
    }
    getBSelectedUpazillaName(upazillaCode) {
        return this.bUpazillaLists.filter(a => a.upazillaCode == upazillaCode)[0].upazillaName;
    }

    setSelectedUnion(seletecteDistrict: string, selectedUpazilla: string, selectedUnion: string) {
        this.bsrInformationService.getUnionList(seletecteDistrict, selectedUpazilla)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.bUnionLists = resData.body.data;
                    this.beneficiaryFormGroup.patchValue({ bUnion: selectedUnion });
                }
                else {
                    console.log("error");
                }
            });
    }
    getBSelectedUnionName(unionCode) {
        return this.bUnionLists.filter(a => a.unionCode == unionCode)[0].unionName;
    }

    /********************************************** Capture Photo **********************************************/
    onPhotoIdSelectedChanges() {
        this.photoIdNo = '';
        if (this.selectedPhotoId === '') {
            this.seletedPhotoIdText = "Photo Id"
            this.photoIdPattern = '';
            this.photoIdNoTooltip = '';
            this.photoIdMaxLength = 0;
        }
        else if (this.selectedPhotoId === 'SmartNID') {
            this.seletedPhotoIdText = "Smart NID"
            this.photoIdPattern = '[0-9]{10}';
            this.photoIdNoTooltip = '10 digits';
            this.photoIdMaxLength = 10;
        }
        else if (this.selectedPhotoId === 'NID') {
            this.seletedPhotoIdText = "NID"
            this.photoIdPattern = '^[0-9]{13}(?:[0-9]{4})?$';
            this.photoIdNoTooltip = '13 or 17 digits';
            this.photoIdMaxLength = 17;
        }
        else if (this.selectedPhotoId === 'PassportNo') {
            this.seletedPhotoIdText = "Passport"
            this.photoIdPattern = '[a-zA-Z]{1,2}[0-9]{7}';
            this.photoIdNoTooltip = '8 or 9 characters';
            this.photoIdMaxLength = 9;
        }
        else if (this.selectedPhotoId === 'DrivingLicense') {
            this.seletedPhotoIdText = "Driving License"
            this.photoIdPattern = '';
            this.photoIdNoTooltip = 'driving license';
            this.photoIdMaxLength = 10;
        }
    }
    getPhotoIdText(photoIdType) {
        if (photoIdType === 'SmartNID') {
            return "Smart NID";
        }
        else if (photoIdType === 'NID') {
            return "NID";
        }
        else if (photoIdType === 'PassportNo') {
            return "Passport";
        }
        else if (photoIdType === 'DrivingLicense') {
            return "Driving License";
        }
        else {
            return "Photo Id";
        }
    }
    setPhotoIdType(photoIdType) {
        if (photoIdType === "SmartNID" && this.photoIdTypes.filter(x => x.value === "SmartNID").length === 0) {
            this.photoIdTypes.push({ 'value': 'SmartNID', 'text': 'Smart NID' });
        }
        else if (photoIdType === "NID" && this.photoIdTypes.filter(x => x.value === "NID").length === 0) {
            this.photoIdTypes.push({ 'value': 'NID', 'text': 'NID' });
        }
        else if (photoIdType === "PassportNo" && this.photoIdTypes.filter(x => x.value === "PassportNo").length === 0) {
            this.photoIdTypes.push({ 'value': 'PassportNo', 'text': 'Passport No.' });
        }
        else if (photoIdType === "DrivingLicense" && this.photoIdTypes.filter(x => x.value === "DrivingLicense").length === 0) {
            this.photoIdTypes.push({ 'value': 'DrivingLicense', 'text': 'Driving License' });
        }
    }
    onPhotoIdRowSelect($event) {
        this.isPhotoIdSelected = true;
        let photoIdFrontPath = $event.data.photoIdFrontPath;
        let photoIdBackPath = $event.data.photoIdBackPath;
        if (photoIdFrontPath.startsWith("data:image/")) {
            this.photoIdFrontPhoto = photoIdFrontPath;
            this.photoIdFrontPhotoCapture = true;
        }
        else if (photoIdFrontPath) {
            this.photoIdFrontPhoto = this.imgPath + photoIdFrontPath.slice(photoIdFrontPath.lastIndexOf("/") + 1, photoIdFrontPath.lastIndexOf(".")) + JPG_EXTENTION;
            this.photoIdFrontPhotoCapture = true;
        }
        if (photoIdBackPath.startsWith("data:image/")) {
            this.photoIdBackPhoto = photoIdBackPath;
            this.photoIdBackPhotoCapture = true;
        }
        else if (photoIdBackPath) {
            this.photoIdBackPhoto = this.imgPath + photoIdBackPath.slice(photoIdBackPath.lastIndexOf("/") + 1, photoIdBackPath.lastIndexOf(".")) + JPG_EXTENTION;
            this.photoIdBackPhotoCapture = true;
        }
    }
    onPhotoIdRowUnselect() {
        this.isPhotoIdSelected = false;
        this.photoIdFrontPhotoCapture = false;
        this.photoIdBackPhotoCapture = false;
        this.photoIdFrontPhoto = "";
        this.photoIdBackPhoto = "";
        this.showUserPhotoUploadBtn = false;
        this.showUserPhotoUploadBtn = false;
    }
    onPhotoAddClick() {
        this.showPhotoDiv = true;
        this.showPhotoAddBtn = false;
        this.hideSenderDiv = true;
        this.hideRemittanceDiv = true;
        this.photoIdInViewMode = false;
        if (this.isUserPhotoAvailable) {
            this.showUserPhotoUploadBtn = false;
        }
        else {
            this.showUserPhotoUploadBtn = true;
        }
        this.showPhotoIdCaptureUploadBtn = true;
        this.showPhotoDivClrDoneClearBtn = true;
        this.viewSeletedPhotoIdDiv = false;
        this.hideBeneficiaryDiv = true;
        this.hideCaptureDiv = false;
        this.photoCaptureClearOnClick();
        for (let i = 0; this.photoIdTypes.length > i; i++) {
            let duplicatePhotoIdType = this.photoIdList.filter(x => x.photoIdType === this.photoIdTypes[i].value);
            if (duplicatePhotoIdType.length > 0) {
                this.photoIdTypes.splice(i, 1);
                i--;
            }
        }
    }
    selectedPhotoIdEdit(photoId) {
        this.setPhotoIdType(photoId.photoIdType);
        this.hideBeneficiaryDiv = true;
        this.hideSenderDiv = true;
        this.hideRemittanceDiv = true;
        this.isPhotoIdInEditMode = true;
        this.selectedCapturedPhotoId = photoId;
        this.isPhotoIdSelected = true;
        this.photoCaptureClearOnClick();
        this.showPhotoAddBtn = false;
        this.showPhotoIdCaptureUploadBtn = true;
        this.showPhotoDivClrDoneClearBtn = true;
        this.viewSeletedPhotoIdDiv = false;
        this.photoIdInViewMode = false;
        if (this.isUserPhotoAvailable) {
            this.showUserPhotoUploadBtn = false;
        }
        else {
            this.showUserPhotoUploadBtn = true;
        }
        this.selectedPhotoId = photoId.photoIdType;
        this.onPhotoIdSelectedChanges();
        this.photoIdNo = photoId.photoIdNo;
        if (photoId.photoIdFrontPath.startsWith("data:image/")) {
            this.photoIdFrontPhoto = photoId.photoIdFrontPath;
            this.photoIdFrontPhotoCapture = true;
        }
        else if (photoId.photoIdFrontPath) {
            this.photoIdFrontPhoto = this.imgPath + photoId.photoIdFrontPath.slice(photoId.photoIdFrontPath.lastIndexOf("/") + 1, photoId.photoIdFrontPath.lastIndexOf(".")) + JPG_EXTENTION;
            this.photoIdFrontPhotoCapture = true;
        }
        if (photoId.photoIdBackPath.startsWith("data:image/")) {
            this.photoIdBackPhoto = photoId.photoIdBackPath;
            this.photoIdBackPhotoCapture = true;
        }
        else if (photoId.photoIdBackPath) {
            this.photoIdBackPhoto = this.imgPath + photoId.photoIdBackPath.slice(photoId.photoIdBackPath.lastIndexOf("/") + 1, photoId.photoIdBackPath.lastIndexOf(".")) + JPG_EXTENTION;
            this.photoIdBackPhotoCapture = true;
        }
    }
    photoCaptureCancelOnClick() {
        if (this.photoIdList.length > 0) {
            this.viewSeletedPhotoIdDiv = true;
            if (this.selectedCapturedPhotoId) {
                let e = { data: this.selectedCapturedPhotoId };
                this.onPhotoIdRowSelect(e);
            }
        }
        else {
            this.viewSeletedPhotoIdDiv = false;
            this.showPhotoDiv = false;
        }
        this.showPhotoAddBtn = true;
        if (this.isUserPhotoAvailable) {
            this.showUserPhotoUploadBtn = false;
        }
        else {
            this.showUserPhotoUploadBtn = true;
        }
        this.showPhotoIdCaptureUploadBtn = false;
        this.showPhotoDivClrDoneClearBtn = false;
        this.hideBeneficiaryDiv = false;
        this.hideCaptureDiv = false;
        this.hideSenderDiv = false;
        this.hideRemittanceDiv = false;
        this.senderAddBtnDisable = false;
        this.isPhotoIdInEditMode = false;
        this.photoIdInViewMode = true;
    }
    photoCaptureClearOnClick() {
        if (!this.isPhotoIdInEditMode) {
            this.selectedPhotoId = '';
            this.photoIdNoTooltip = '';
            this.photoIdNo = '';
        }
        this.photoIdFrontPhotoCapture = false;
        this.photoIdBackPhotoCapture = false;
        this.photoIdFrontPhoto = '';
        this.seletedPhotoIdText = "Photo Id"
        this.photoIdBackPhoto = '';
    }
    photoCaptureDoneOnClick() {
        this.showPhotoAddBtn = true;
        if (this.isUserPhotoAvailable) {
            this.showUserPhotoUploadBtn = false;
        }
        else {
            this.showUserPhotoUploadBtn = true;
        }
        this.showPhotoIdCaptureUploadBtn = false;
        this.showPhotoDivClrDoneClearBtn = false;
        this.viewSeletedPhotoIdDiv = true;
        this.hideBeneficiaryDiv = false;
        this.hideCaptureDiv = false;
        this.hideSenderDiv = false;
        this.senderAddBtnDisable = false;
        this.photoIdInViewMode = true;
        if (this.isPhotoIdInEditMode) {
            let photoIdInInsert = this.photoIdListForInsertUpdate.filter(x => x.photoIdNo === this.photoIdNo && x.photoIdAddFlag === "Yes");
            let photoIdInEdit = this.photoIdListForInsertUpdate.filter(x => x.photoIdNo === this.photoIdNo && x.photoIdEditFlag === "Yes");
            if (photoIdInInsert.length > 0) {
                photoIdInInsert[0].photoIdFront = this.photoIdFrontPhoto;
                photoIdInInsert[0].photoIdBack = this.photoIdBackPhoto;
            }
            else if (photoIdInEdit.length > 0) {
                photoIdInEdit[0].photoIdFront = this.photoIdFrontPhoto;
                photoIdInEdit[0].photoIdBack = this.photoIdBackPhoto;
            }
            else {
                this.photoIdListForInsertUpdate.push({
                    photoIdFront: this.photoIdFrontPhoto,
                    photoIdBack: this.photoIdBackPhoto,
                    photoIdNo: this.photoIdNo,
                    photoIdType: this.selectedPhotoId,
                    photoIdAddFlag: "No",
                    photoIdEditFlag: "Yes"
                });
            }
            this.selectedCapturedPhotoId.photoIdFrontPath = this.photoIdFrontPhoto;
            this.selectedCapturedPhotoId.photoIdBackPath = this.photoIdBackPhoto;
        }
        else {
            this.photoIdListForInsertUpdate.push({
                photoIdFront: this.photoIdFrontPhoto,
                photoIdBack: this.photoIdBackPhoto,
                photoIdNo: this.photoIdNo,
                photoIdType: this.selectedPhotoId,
                photoIdAddFlag: "Yes",
                photoIdEditFlag: "No"
            });
            let photoId = {
                photoIdFrontPath: this.photoIdFrontPhoto,
                photoIdBackPath: this.photoIdBackPhoto,
                photoIdNo: this.photoIdNo,
                photoIdType: this.selectedPhotoId
            };
            this.photoIdList.unshift(photoId);
            this.selectedCapturedPhotoId = photoId;
            this.isPhotoIdSelected = true;
        }
        this.isPhotoIdInEditMode = false;
        if (this.selectedSender) {
            this.hideRemittanceDiv = false;
        }
    }
    captureUserPhoto(photo) {
        this.userPhotoDialog = false;
        this.userPhotoCapture = true;
        this.userPhoto = photo;
    }
    captureFrontPhoto(photo) {
        this.photoIdFrontDialog = false;
        this.photoIdFrontPhotoCapture = true;
        this.photoIdFrontPhoto = photo;
    }
    captureBackPhoto(photo) {
        this.photoIdBackDialog = false;
        this.photoIdBackPhotoCapture = true;
        this.photoIdBackPhoto = photo;
    }
    onPhotoSelect(event) {
        if (event.files.length > 0) {
            if (!event.files[0].type.includes("image/")) {
                this.growlMessage = [];
                this.growlMessage.push({ severity: 'error', summary: 'Invalid file type', detail: 'Upload image file' });
            } else if (event.files[0].size > 1000000) {
                this.growlMessage = [];
                this.growlMessage.push({ severity: 'error', summary: 'Invalid photo size', detail: 'Photo size limit: 1MB' });
            }
        }
    }
    userPhotoUploadHandler(event) {
        let reader = new FileReader();
        reader.readAsDataURL(event.files[0]);
        reader.onloadend = () => {
            this.userPhotoCapture = true;
            this.userPhoto = reader.result;
        }
    }
    photoIdFrontUploadHandler(event) {
        let reader = new FileReader();
        reader.readAsDataURL(event.files[0]);
        reader.onloadend = () => {
            this.photoIdFrontPhotoCapture = true;
            this.photoIdFrontPhoto = reader.result;
        }
    }
    photoIdBackUploadHandler(event) {
        let reader = new FileReader();
        reader.readAsDataURL(event.files[0]);
        reader.onloadend = () => {
            this.photoIdBackPhotoCapture = true;
            this.photoIdBackPhoto = reader.result;
        }
    }
    /********************************************** Sender **********************************************/
    onSNameRowSelect($event) {
        this.isSenderSelected = true;
        this.showInputSenderControls = true;
        this.hideRemittanceDiv = false;
        this.senderOid = $event.data.oid;
        this.senderFormGroup.patchValue({ sName: $event.data.fullName });
        this.senderFormGroup.patchValue({ sCountry: $event.data.residenceCountry });
        this.senderFormGroup.patchValue({ sCity: $event.data.residenceCity });
        this.senderFormGroup.patchValue({ sMobile: $event.data.mobileNoOverseas });
        this.senderFormGroup.patchValue({ sGenderType: $event.data.gender });

        let permanentAddress = $event.data.permanentAddress;
        if (permanentAddress.addressLine1) {
            this.senderFormGroup.patchValue({ sPermanentAddress: permanentAddress.addressLine1 + " " + permanentAddress.addressLine2 });
        }
        if (permanentAddress.divisionGeocode && permanentAddress.divisionGeocode !== '') {
            this.senderFormGroup.patchValue({ sDivision: permanentAddress.divisionGeocode });
        }
        else {
            this.senderFormGroup.patchValue({ sDivision: '' });
        }
        if (permanentAddress.divisionGeocode && permanentAddress.districtGeocode !== '') {
            this.setSenderSelectedDistrict(permanentAddress.divisionGeocode, permanentAddress.districtGeocode);
        }
        else {
            this.senderFormGroup.patchValue({ sDistrict: '' });
        }
        if (permanentAddress.districtGeocode && permanentAddress.upazillaGeocode !== '') {
            this.setSenderSelectedUpazilla(permanentAddress.districtGeocode, permanentAddress.upazillaGeocode);
        }
        else {
            this.senderFormGroup.patchValue({ sUpazilla: '' });
        }
        if (permanentAddress.districtGeocode && permanentAddress.upazillaGeocode !== '' && permanentAddress.unionGeocode !== '') {
            this.setSenderSelectedUnion(permanentAddress.districtGeocode, permanentAddress.upazillaGeocode, permanentAddress.unionGeocode);
        }
        else {
            this.senderFormGroup.patchValue({ sUnion: '' });
        }

        if ($event.data.socialMediaFlag == "Yes") {
            this.sSocialMediaFlag = true;
            this.isNewSenderSocialMedia = 'No';
            this.sFacebookId = $event.data.socialMediaJson.facebook;
            this.sImo = $event.data.socialMediaJson.imo === "Yes" ? true : false;
            this.sInternet = $event.data.socialMediaJson.internetUser === "Yes" ? true : false;
            this.sSmartPhone = $event.data.socialMediaJson.smartphoneUser === "Yes" ? true : false;
            this.sViber = $event.data.socialMediaJson.viber === "Yes" ? true : false;
            this.sWhatsapp = $event.data.socialMediaJson.whatsapp === "Yes" ? true : false;
        }
        else {
            //this.isNewSenderSocialMedia = 'Yes';
            this.sSocialMediaFlag = false;
            this.sFacebookId = "";
            this.sImo = false;
            this.sInternet = false;
            this.sSmartPhone = false;
            this.sViber = false;
            this.sWhatsapp = false;
        }
    }
    onSNameRowUnselect($event) {
        this.isSenderSelected = false;
        this.showInputSenderControls = false;
        this.senderFormGroup.patchValue({ sName: '' });
        this.senderFormGroup.patchValue({ sCountry: '' });
        this.senderFormGroup.patchValue({ sCity: '' });
        this.senderFormGroup.patchValue({ sMobile: '' });
        this.senderFormGroup.patchValue({ sGenderType: '' });
        this.senderFormGroup.patchValue({ sDivision: '' });
        this.senderFormGroup.patchValue({ sDistrict: '' });
        this.senderFormGroup.patchValue({ sUpazilla: '' });
        this.senderFormGroup.patchValue({ sUnion: '' });
        this.senderFormGroup.patchValue({ sPresentAddress: '' });
    }
    /*-------------------------Sender: edit--------------------------*/
    selectedSenderEdit($event) {
        this.selectedSender = $event;
        this.editSenderId = $event.senderId;
        this.showSenderAddBtn = false;

        this.hideBeneficiaryDiv = true;
        this.hideCaptureDiv = true;
        this.hideRemittanceDiv = true;

        this.isSenderEditMode = true;
        this.isSenderSelected = true;
        this.enableSenderControls();
        this.showSenderList = false;
        this.showSenderMendatoryDiv = true;
        this.showInputSenderName = true;
        this.showInputSenderControls = true;
        this.senderFormGroup.patchValue({ sName: $event.fullName });
        this.senderFormGroup.patchValue({ sCountry: $event.residenceCountry });
        this.senderFormGroup.patchValue({ sCity: $event.residenceCity });
        this.senderFormGroup.patchValue({ sMobile: $event.mobileNoOverseas });
        this.senderFormGroup.patchValue({ sGenderType: $event.gender });

        let permanentAddress = $event.permanentAddress;
        if (permanentAddress.addressLine1) {
            this.senderFormGroup.patchValue({ sPermanentAddress: permanentAddress.addressLine1 + permanentAddress.addressLine2 });
        }
        if (permanentAddress.divisionGeocode && permanentAddress.divisionGeocode !== '') {
            this.senderFormGroup.patchValue({ sDivision: permanentAddress.divisionGeocode });
        }
        else {
            this.senderFormGroup.patchValue({ sDivision: '' });
        }
        if (permanentAddress.divisionGeocode && permanentAddress.districtGeocode !== '') {
            this.setSenderSelectedDistrict(permanentAddress.divisionGeocode, permanentAddress.districtGeocode);
        }
        else {
            this.senderFormGroup.patchValue({ sDistrict: '' });
        }
        if (permanentAddress.districtGeocode && permanentAddress.upazillaGeocode !== '') {
            this.setSenderSelectedUpazilla(permanentAddress.districtGeocode, permanentAddress.upazillaGeocode);
        }
        else {
            this.senderFormGroup.patchValue({ sUpazilla: '' });
        }
        if (permanentAddress.districtGeocode && permanentAddress.upazillaGeocode !== '' && permanentAddress.unionGeocode !== '') {
            this.setSenderSelectedUnion(permanentAddress.districtGeocode, permanentAddress.upazillaGeocode, permanentAddress.unionGeocode);
        }
        else {
            this.senderFormGroup.patchValue({ sUnion: '' });
        }

        if ($event.socialMediaFlag == "Yes") {
            this.sFacebookId = $event.socialMediaJson.facebook;
            this.sImo = $event.socialMediaJson.imo === "Yes" ? true : false;
            this.sInternet = $event.socialMediaJson.internetUser === "Yes" ? true : false;
            this.sSmartPhone = $event.socialMediaJson.smartphoneUser === "Yes" ? true : false;
            this.sViber = $event.socialMediaJson.viber === "Yes" ? true : false;
            this.sWhatsapp = $event.socialMediaJson.whatsapp === "Yes" ? true : false;
        }
    }
    /*-------------------------Sender: Add--------------------------*/
    addNewSender() {
        this.clearAllSenderData();
        this.isSenderEditMode = false;
        this.enableSenderControls();
        this.showInputSenderName = true;
        this.showInputSenderControls = true;
        this.showSenderList = false;
        this.showSenderMendatoryDiv = true;

        this.showSenderDiv = true;
        this.hideBeneficiaryDiv = true;
        this.hideCaptureDiv = true;
        this.showSenderAddBtn = false;
    }
    senderCancelOnClick() {
        if (this.senderList.length > 0) {
            this.showSenderList = true;
            this.showSenderMendatoryDiv = true;
            this.showInputSenderName = false;
            this.showSenderDiv = true;

            this.hideBeneficiaryDiv = false;
            this.hideCaptureDiv = false;
            this.hideRemittanceDiv = false;
            if (this.selectedSender) {
                let e = { data: this.selectedSender };
                this.onSNameRowSelect(e);
            }
            if (!this.selectedSender) {
                this.showInputSenderControls = false;
            }
            this.disableSenderControls();
        }
        else {
            this.showInputSenderName = false;
            this.showSenderMendatoryDiv = false;
            this.showInputSenderControls = false;
            this.showSenderDiv = false;
            this.disableSenderControls();
        }
        this.showSenderAddBtn = true;
    }
    clearAllSenderData() {
        this.senderFormGroup.patchValue({ sName: '' });
        this.senderFormGroup.patchValue({ sCountry: '' });
        this.senderFormGroup.patchValue({ sCity: '' });
        this.senderFormGroup.patchValue({ sMobile: '' });
        this.senderFormGroup.patchValue({ sGenderType: '' });
        this.senderFormGroup.patchValue({ sDivision: '' });
        this.senderFormGroup.patchValue({ sDistrict: '' });
        this.senderFormGroup.patchValue({ sUpazilla: '' });
        this.senderFormGroup.patchValue({ sUnion: '' });
        this.senderFormGroup.patchValue({ permanentAddress: '' });
        this.sSocialMediaFlag = false;
        this.sFacebookId = '';
        this.sImo = false;
        this.sInternet = false;
        this.sSmartPhone = false;
        this.sViber = false;
        this.sWhatsapp = false;
    }

    senderClearOnClick() {
        this.clearAllSenderData();
    }

    senderDoneOnClick() {
        let isNewSenderEdit = this.senderList.filter(x => x.senderId == this.editSenderId && x.senderAddFlag === "Yes");
        let index = this.senderList.findIndex(e => e.senderId == this.editSenderId);
        if (this.isSenderEditMode) {
            //this.senderListForInsertUpdate.push({
            //    fullName: this.senderFormGroup.get('sName').value,
            //    residenceCountry: this.senderFormGroup.get('sCountry').value,
            //    residenceCity: this.senderFormGroup.get('sCity').value,
            //    mobileNoOverseas: this.senderFormGroup.get('sMobile').value,
            //    gender: this.senderFormGroup.get('sGenderType').value,
            //    permanentAddress: {
            //        addressLine1: this.senderFormGroup.get('sPermanentAddress').value,
            //        addressLine2: this.senderFormGroup.get('sPermanentAddress').value,
            //        divisionGeocode: this.senderFormGroup.get('sDivision').value,
            //        districtGeocode: this.senderFormGroup.get('sDistrict').value,
            //        upazillaGeocode: this.senderFormGroup.get('sUpazilla').value,
            //        unionGeocode: this.senderFormGroup.get('sUnion').value,
            //    },
            //    socialMediaFlag: this.sSocialMediaFlag == true ? "Yes" : "No",
            //    socialMediaJson: {
            //        facebook: this.sFacebookId,
            //        imo: this.sImo == true ? 'Yes' : 'No',
            //        internetUser: this.sInternet == true ? 'Yes' : 'No',
            //        smartphoneUser: this.sSmartPhone == true ? 'Yes' : 'No',
            //        viber: this.sViber == true ? 'Yes' : 'No',
            //        whatsapp: this.sWhatsapp == true ? 'Yes' : 'No'
            //    },
            //    senderIdAdd: this.editSenderId,
            //    senderAddFlag: "No",
            //    senderEditFlag: "Yes"
            //});
            if (isNewSenderEdit.length == 1) {
                let senderList = {
                    fullName: this.senderFormGroup.get('sName').value,
                    residenceCountry: this.senderFormGroup.get('sCountry').value,
                    residenceCity: this.senderFormGroup.get('sCity').value,
                    mobileNoOverseas: this.senderFormGroup.get('sMobile').value,
                    gender: this.senderFormGroup.get('sGenderType').value,
                    permanentAddress: {
                        addressLine1: this.senderFormGroup.get('sPermanentAddress').value,
                        addressLine2: this.senderFormGroup.get('sPermanentAddress').value,
                        divisionGeocode: this.senderFormGroup.get('sDivision').value,
                        districtGeocode: this.senderFormGroup.get('sDistrict').value,
                        upazillaGeocode: this.senderFormGroup.get('sUpazilla').value,
                        unionGeocode: this.senderFormGroup.get('sUnion').value,
                    },
                    senderAddFlag: "Yes",
                    senderEditFlag: "No",
                    senderId: this.editSenderId,
                    socialMediaFlag: this.sSocialMediaFlag == true ? "Yes" : "No",
                    socialMediaJson: {
                        facebook: this.sFacebookId,
                        imo: this.sImo == true ? 'Yes' : 'No',
                        internetUser: this.sInternet == true ? 'Yes' : 'No',
                        smartphoneUser: this.sSmartPhone == true ? 'Yes' : 'No',
                        viber: this.sViber == true ? 'Yes' : 'No',
                        whatsapp: this.sWhatsapp == true ? 'Yes' : 'No'
                    }
                };
                this.senderList[index] = senderList;
                this.selectedSender = senderList;
                this.isSenderSelected = true;
            }
            else {
                let senderList = {
                    fullName: this.senderFormGroup.get('sName').value,
                    residenceCountry: this.senderFormGroup.get('sCountry').value,
                    residenceCity: this.senderFormGroup.get('sCity').value,
                    mobileNoOverseas: this.senderFormGroup.get('sMobile').value,
                    gender: this.senderFormGroup.get('sGenderType').value,
                    permanentAddress: {
                        addressLine1: this.senderFormGroup.get('sPermanentAddress').value,
                        addressLine2: this.senderFormGroup.get('sPermanentAddress').value,
                        divisionGeocode: this.senderFormGroup.get('sDivision').value,
                        districtGeocode: this.senderFormGroup.get('sDistrict').value,
                        upazillaGeocode: this.senderFormGroup.get('sUpazilla').value,
                        unionGeocode: this.senderFormGroup.get('sUnion').value,
                    },
                    senderAddFlag: "No",
                    senderEditFlag: "Yes",
                    senderId: this.editSenderId,
                    socialMediaFlag: this.sSocialMediaFlag == true ? "Yes" : "No",
                    socialMediaJson: {
                        facebook: this.sFacebookId,
                        imo: this.sImo == true ? 'Yes' : 'No',
                        internetUser: this.sInternet == true ? 'Yes' : 'No',
                        smartphoneUser: this.sSmartPhone == true ? 'Yes' : 'No',
                        viber: this.sViber == true ? 'Yes' : 'No',
                        whatsapp: this.sWhatsapp == true ? 'Yes' : 'No'
                    }
                };
                this.senderList[index] = senderList;
                this.selectedSender = senderList;
                this.isSenderSelected = true;
            }
        }
        else {
            let addSenderId = Math.floor(Math.random() * (10000000000)).toString();
            //this.senderListForInsertUpdate.push({
            //    fullName: this.senderFormGroup.get('sName').value,
            //    residenceCountry: this.senderFormGroup.get('sCountry').value,
            //    residenceCity: this.senderFormGroup.get('sCity').value,
            //    mobileNoOverseas: this.senderFormGroup.get('sMobile').value,
            //    gender: this.senderFormGroup.get('sGenderType').value,
            //    permanentAddress: {
            //        addressLine1: this.senderFormGroup.get('sPermanentAddress').value,
            //        addressLine2: this.senderFormGroup.get('sPermanentAddress').value,
            //        divisionGeocode: this.senderFormGroup.get('sDivision').value,
            //        districtGeocode: this.senderFormGroup.get('sDistrict').value,
            //        upazillaGeocode: this.senderFormGroup.get('sUpazilla').value,
            //        unionGeocode: this.senderFormGroup.get('sUnion').value,
            //    },
            //    socialMediaFlag: this.sSocialMediaFlag == true ? "Yes" : "No",
            //    socialMediaJson: {
            //        facebook: this.sFacebookId,
            //        imo: this.sImo == true ? 'Yes' : 'No',
            //        internetUser: this.sInternet == true ? 'Yes' : 'No',
            //        smartphoneUser: this.sSmartPhone == true ? 'Yes' : 'No',
            //        viber: this.sViber == true ? 'Yes' : 'No',
            //        whatsapp: this.sWhatsapp == true ? 'Yes' : 'No'
            //    },
            //    senderIdAdd: addSenderId,
            //    senderAddFlag: "Yes",
            //    senderEditFlag: "No"
            //});
            let senderList = {
                fullName: this.senderFormGroup.get('sName').value,
                residenceCountry: this.senderFormGroup.get('sCountry').value,
                residenceCity: this.senderFormGroup.get('sCity').value,
                mobileNoOverseas: this.senderFormGroup.get('sMobile').value,
                gender: this.senderFormGroup.get('sGenderType').value,
                permanentAddress: {
                    addressLine1: this.senderFormGroup.get('sPermanentAddress').value,
                    addressLine2: this.senderFormGroup.get('sPermanentAddress').value,
                    divisionGeocode: this.senderFormGroup.get('sDivision').value,
                    districtGeocode: this.senderFormGroup.get('sDistrict').value,
                    upazillaGeocode: this.senderFormGroup.get('sUpazilla').value,
                    unionGeocode: this.senderFormGroup.get('sUnion').value,
                },
                senderAddFlag: "Yes",
                senderEditFlag: "No",
                senderId: addSenderId,
                socialMediaFlag: this.sSocialMediaFlag == true ? "Yes" : "No",
                socialMediaJson: {
                    facebook: this.sFacebookId,
                    imo: this.sImo == true ? 'Yes' : 'No',
                    internetUser: this.sInternet == true ? 'Yes' : 'No',
                    smartphoneUser: this.sSmartPhone == true ? 'Yes' : 'No',
                    viber: this.sViber == true ? 'Yes' : 'No',
                    whatsapp: this.sWhatsapp == true ? 'Yes' : 'No'
                }
            };
            this.senderList.unshift(senderList);
            this.selectedSender = senderList;
            this.isSenderSelected = true;
        }
        this.isSenderEditMode = false;

        this.showSenderList = true;
        this.showSenderMendatoryDiv = true;
        this.showInputSenderName = false;
        this.showSenderDiv = true;
        this.disableSenderControls();
        this.capAddBtnDisable = true;

        this.hideBeneficiaryDiv = false;
        this.hideCaptureDiv = false;
        this.hideRemittanceDiv = false;

        this.showSenderAddBtn = true;
    }

    disableSenderControls() {
        this.isDisableSenderControl = true;
        this.senderFormGroup.get('sName').disable();
        this.senderFormGroup.get('sCountry').disable();
        this.senderFormGroup.get('sCity').disable();
        this.senderFormGroup.get('sMobile').disable();
        this.senderFormGroup.get('sGenderType').disable();
        this.senderFormGroup.get('sPermanentAddress').disable();
        this.senderFormGroup.get('sDivision').disable();
        this.senderFormGroup.get('sDistrict').disable();
        this.senderFormGroup.get('sUpazilla').disable();
        this.senderFormGroup.get('sUnion').disable();
    }
    enableSenderControls() {
        this.isDisableSenderControl = false;
        this.senderFormGroup.get('sName').enable();
        this.senderFormGroup.get('sCountry').enable();
        this.senderFormGroup.get('sCity').enable();
        this.senderFormGroup.get('sMobile').enable();
        this.senderFormGroup.get('sGenderType').enable();
        this.senderFormGroup.get('sPermanentAddress').enable();
        this.senderFormGroup.get('sDivision').enable();
        this.senderFormGroup.get('sDistrict').enable();
        this.senderFormGroup.get('sUpazilla').enable();
        this.senderFormGroup.get('sUnion').enable();
    }

    /*---------------------- Sender: Social Media -----------------------*/
    addSenderSocialMediaInfo() {
        this.sSocialMediaModal = true;
    }
    onSenderSocialDoneClick() {
        this.sSocialMediaFlag = true;
        this.sSocialMediaModal = false;
        if (this.isNewSenderSocialMedia !== 'No') {
            this.isNewSenderSocialMedia = 'Yes';
        }
    }

    /*---------------------- Sender: GEO Code -----------------------*/
    sDivisionSelectionChange() {
        this.sUpazillaLists = [];
        this.sUnionLists = [];
        this.bsrInformationService.getDistrictList(this.senderFormGroup.get('sDivision').value)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.sDistrictLists = resData.body.data;
                    //this.bsrInformationService.getThanaList(this.sDistrictLists[0].districtCode)
                    //    .subscribe(resData => {
                    //        if (resData != null && resData.header.responseCode == '200') {
                    //            this.sUpazillaLists = resData.body.data;
                    //            this.senderFormGroup.patchValue({ sUpazilla: this.sUpazillaLists[0].upazillaCode });
                    //            this.bsrInformationService.getUnionList(this.sDistrictLists[0].districtCode, this.sUpazillaLists[0].upazillaCode)
                    //                .subscribe(resData => {
                    //                    if (resData != null && resData.header.responseCode == '200') {
                    //                        this.sUnionLists = resData.body.data;
                    //                        this.senderFormGroup.patchValue({ sUnion: this.sUnionLists[0].unionCode });
                    //                    }
                    //                    else {
                    //                        this.sUnionLists = [];
                    //                    }
                    //                }, err => {
                    //                    this.growlMessage = [];
                    //                    this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load union data' });
                    //                });
                    //        }
                    //        else {
                    //            this.sUpazillaLists = [];
                    //        }
                    //    }, err => {
                    //        this.growlMessage = [];
                    //        this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load upazilla data' });
                    //    });
                }
                else {
                    console.log("error");
                }
            });
    }
    getSSelectedDivisionName(divisionCode) {
        return this.sDivisionLists.filter(a => a.divisionCode == divisionCode)[0].divisionName;
    }

    setSenderSelectedDistrict(selectedDivision: string, selectedDistrictCode: string) {
        this.sUpazillaLists = [];
        this.sUnionLists = [];
        this.bsrInformationService.getDistrictList(selectedDivision)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.sDistrictLists = resData.body.data;
                    this.senderFormGroup.patchValue({ sDistrict: selectedDistrictCode });
                }
                else {
                    console.log("error");
                }
            });
    }
    sDistrictSelectionChange() {
        this.sUpazillaLists = [];
        this.sUnionLists = [];
        this.bsrInformationService.getThanaList(this.senderFormGroup.get('sDistrict').value)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.sUpazillaLists = resData.body.data;
                    //this.senderFormGroup.patchValue({ sUpazilla: this.sUpazillaLists[0].upazillaCode });
                    //this.bsrInformationService.getUnionList(this.senderFormGroup.get('sDistrict').value, this.sUpazillaLists[0].upazillaCode)
                    //    .subscribe(resData => {
                    //        if (resData != null && resData.header.responseCode == '200') {
                    //            this.sUnionLists = resData.body.data;
                    //            this.senderFormGroup.patchValue({ sUnion: this.sUnionLists[0].unionCode });
                    //        }
                    //        else {
                    //            this.sUnionLists = [];
                    //        }
                    //    }, err => {
                    //        this.growlMessage = [];
                    //        this.growlMessage.push({ severity: 'error', summary: '', detail: 'Failed to load union data' });
                    //    });
                }
                else {
                    console.log("error");
                }
            });
    }
    getSSelectedDistrictName(districtCode) {
        return this.sDistrictLists.filter(a => a.districtCode == districtCode)[0].districtName;
    }

    setSenderSelectedUpazilla(selectedDistrictCode: string, selectedUpazilla: string) {
        this.sUpazillaLists = [];
        this.sUnionLists = [];
        this.bsrInformationService.getThanaList(selectedDistrictCode)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.sUpazillaLists = resData.body.data;
                    this.senderFormGroup.patchValue({ sUpazilla: selectedUpazilla });
                }
                else {
                    console.log("error");
                }
            });
    }
    sUpazillaSelectionChange() {
        this.sUnionLists = [];
        this.bsrInformationService.getUnionList(this.senderFormGroup.get('sDistrict').value, this.senderFormGroup.get('sUpazilla').value)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.sUnionLists = resData.body.data;
                    //this.senderFormGroup.patchValue({ sUnion: this.sUnionLists[0].unionCode });
                }
                else {
                    console.log("error");
                }
            });
    }
    getSSelectedUpazillaName(upazillaCode) {
        return this.sUpazillaLists.filter(a => a.upazillaCode == upazillaCode)[0].upazillaName;
    }

    setSenderSelectedUnion(seletecteDistrict: string, selectedUpazilla: string, selectedUnion: string) {
        this.bsrInformationService.getUnionList(seletecteDistrict, selectedUpazilla)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.sUnionLists = resData.body.data;
                    this.senderFormGroup.patchValue({ sUnion: selectedUnion });
                }
                else {
                    console.log("error");
                }
            });
    }
    getSSelectedUnionName(unionCode) {
        return this.sUnionLists.filter(a => a.unionCode == unionCode)[0].unionName;
    }

    /********************************************** Remittance **********************************************/
    onPinNumberChange(pinNumber: string) {
        let filterExchangeList = this.allExchangeHouseLists.filter(a => a.digitOfPinNo && a.digitOfPinNo === pinNumber.length.toString());
        if (filterExchangeList.length > 0) {
            this.filteredExchangeHouseLists = filterExchangeList;
        }
        else {
            this.filteredExchangeHouseLists = this.allExchangeHouseLists;
        }
    }
    ExchangeHouseSelectionChange() {
        let filterExchangeList = this.allExchangeHouseLists.filter(a => a.oid === this.selectedexchangeHouse && a.ttNumber && a.ttNumber === 'Yes');
        if (filterExchangeList.length > 0) {
            this.disableTTNumber = false;
        }
        else {
            this.disableTTNumber = true;
        }
    }
    getSelectedExchangeHouseName(selectedexchangeHouse) {
        return this.allExchangeHouseLists.filter(a => a.oid === this.selectedexchangeHouse)[0].exHouseName;
    }
    /********************************************** IFR  **********************************************/
    getFormatDate(inputDate) {
        if (inputDate != '') {
            let Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            if (inputDate.toString().includes('-')) {
                let splitByComma = inputDate.split('-');
                return Months[splitByComma[1] - 1] + ' ' + splitByComma[0] + ', ' + splitByComma[2];
            }
            else {
                let date = new Date(inputDate);
                return Months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
            }
        }
    }
    removeAllComaFromAmount(amount) {
        if (amount) {
            return amount.toString().replace(/,/g, '');
        }
        else {

        }
    }
    checkVerifyAmount() {
        if (this.inputAmount && this.verifyAmount) {
            if (this.removeAllComaFromAmount(this.inputAmount) != this.removeAllComaFromAmount(this.verifyAmount)) {

                setTimeout(() => this.verifyAmountNgModel.control.setErrors({ 'nomatch': true }), 0);
            }
            else {

                setTimeout(() => this.verifyAmountNgModel.control.setErrors(null), 0);
            }
        }
        else {

            setTimeout(() => this.verifyAmountNgModel.control.setErrors({ 'nomatch': true }), 0);
        }
    }
    OnIFRSubmitClick() {

        if (this.selectedSender.senderAddFlag && this.selectedSender.senderAddFlag === "Yes") {
            this.isNewSender = "Yes";
            this.isSenderDetailUpdate = "No";
            this.selectedSender;
        }
        else if (this.selectedSender.senderAddFlag && this.selectedSender.senderEditFlag === "Yes") {
            this.isNewSender = "No";
            this.isSenderDetailUpdate = "Yes";
            this.selectedSender;
        }
        else {
            this.isNewSender = "No";
            this.isSenderDetailUpdate = "No";
            this.selectedSender;
        }
        if (this.isNewPerson) {
            this.newPerson = "Yes";
        }
        else {
            this.newPerson = "No";
        }
        /*remittanceInformation*/
        this.remittanceInformation =
            {
                oid: this.remittanceRequestDetails.remittanceDeatils.oid,
                photoId: this.selectedCapturedPhotoId.photoIdNo,
                photoIdType: this.selectedCapturedPhotoId.photoIdType,
                nidVerification: this.remittanceNIDVerification,
                recipientMobileNo: this.selectedBMobile.mobileNo,
                recipientName: this.beneficiaryFormGroup.get('bName').value,
                recipientGender: this.beneficiaryFormGroup.get('bGenderType').value,
                recipientDOB: this.getFormatDate(this.beneficiaryFormGroup.get('bDateOfBirth').value),
                pin: this.pinNumber,
                ttNumber: this.tTNumber,
                amount: this.removeAllComaFromAmount(this.amount),
                //actualAmountInBdt: this.removeAllComaFromAmount(this.verifyAmount),
                senderCountry: this.senderFormGroup.get('sCountry').value,
                senderName: this.senderFormGroup.get('sName').value,
                exHouseOid: this.selectedexchangeHouse,
                exHouseName: this.getSelectedExchangeHouseName(this.selectedexchangeHouse)
            };



        /*recipientDetails*/

        let bPresentAddress = {
            addressLine1: this.beneficiaryFormGroup.get('bPresentAddress').value,
            addressLine2: this.beneficiaryFormGroup.get('bPresentAddress').value,
            addressLine3: this.beneficiaryFormGroup.get('bPresentAddress').value,
            postalCode: this.beneficiaryFormGroup.get('bPresentAddress').value,
            divisionName: this.beneficiaryFormGroup.get('bDivision').value == '' ? '' : this.getBSelectedDivisionName(this.beneficiaryFormGroup.get('bDivision').value),
            divisionGeocode: this.beneficiaryFormGroup.get('bDivision').value,
            districtName: this.beneficiaryFormGroup.get('bDistrict').value == '' ? '' : this.getBSelectedDistrictName(this.beneficiaryFormGroup.get('bDistrict').value),
            districtGeocode: this.beneficiaryFormGroup.get('bDistrict').value,
            upazillaName: this.beneficiaryFormGroup.get('bUpazilla').value == '' ? '' : this.getBSelectedUpazillaName(this.beneficiaryFormGroup.get('bUpazilla').value),
            upazillaGeocode: this.beneficiaryFormGroup.get('bUpazilla').value,
            unionName: this.beneficiaryFormGroup.get('bUnion').value == '' ? '' : this.getBSelectedUnionName(this.beneficiaryFormGroup.get('bUnion').value),
            unionGeocode: this.beneficiaryFormGroup.get('bUnion').value,
            country: 'BANGLADESH'
        };


        let bSocialMediaJson;

        if (this.bSocialMediaFlag) {
            bSocialMediaJson = {
                facebook: this.bFacebookId,
                email: this.bEmail,
                imo: this.bImo ? 'Yes' : 'No',
                viber: this.bViber ? 'Yes' : 'No',
                whatsapp: this.bWhatsapp ? 'Yes' : 'No',
                smartphoneUser: this.bSmartPhone ? 'Yes' : 'No',
                internetUser: this.bInternet ? 'Yes' : 'No',
            };
        }
        else {
            bSocialMediaJson = {
                facebook: '',
                email:'',
                imo: 'No',
                viber: 'No',
                whatsapp: 'No',
                smartphoneUser: 'No',
                internetUser: 'No'
            };
        }
        let photoIdUnchangedList = this.photoIdList.filter((item) => {
            return this.photoIdListForInsertUpdate.filter(x => x.photoIdNo == item.photoIdNo).length == 0;
        });
        for (let i = 0; photoIdUnchangedList.length > i; i++) {
            this.photoIdListForInsertUpdate.push({
                photoIdFront: photoIdUnchangedList[i].photoIdFrontPath,
                photoIdBack: photoIdUnchangedList[i].photoIdBackPath,
                photoIdNo: photoIdUnchangedList[i].photoIdNo,
                photoIdType: photoIdUnchangedList[i].photoIdType,
                photoIdAddFlag: "No",
                photoIdEditFlag: "No"
            });
        }
        let fpDetailsData = {
            rt: this.rt == '' ? 'NOT_SCANNED' : "ENROLLED",
            ri: this.ri == '' ? 'NOT_SCANNED' : "ENROLLED",
            rm: this.rm,
            rr: this.rr,
            rp: this.rp,
            lt: this.lt == '' ? 'NOT_SCANNED' : "ENROLLED",
            li: this.li == '' ? 'NOT_SCANNED' : "ENROLLED",
            lm: this.lm,
            lr: this.lr,
            lp: this.lp
        }

        this.fingerPrintData = {
            fpDeviceModelOid: "Morpho-MSO1300E2",
            fpDeviceOid: "FD0000075",
            fpDeviceMnemonic: "Morpho-MSO1300E2",
            clientSideSdk: "MorphoSDK.6",
            serverSideSdk: "GriauleSDK",
            defaultFinger: "",
            fpDetails: fpDetailsData,
            ri: this.ri == '' || this.ri == 'FINGER_NOT_PRESENT' ? {} : { '1': this.ri },
            rt: this.rt == '' || this.rt == 'FINGER_NOT_PRESENT' ? {} : { '1': this.rt },
            rm: {},
            rr: {},
            rp: {},
            lt: this.lt == '' || this.lt == 'FINGER_NOT_PRESENT' ? {} : { '1': this.lt },
            li: this.li == '' || this.li == 'FINGER_NOT_PRESENT' ? {} : { '1': this.li },
            lm: {},
            lr: {},
            lp: {},
            riMeta: {},
            rmMeta: {},
            rtMeta: {},
            rrMeta: {},
            liMeta: {},
            lmMeta: {},
            lpMeta: {},
            lrMeta: {},
            ltMeta: {},
            rpMeta: {}
        };

        this.recipientDetails = {
            oid: this.personOid,
            fullName: this.beneficiaryFormGroup.get('bName').value,
            dateOfBirth: this.getFormatDate(this.beneficiaryFormGroup.get('bDateOfBirth').value),
            gender: this.beneficiaryFormGroup.get('bGenderType').value,
            nidVerification: this.personNIDVerification,
            email: this.bEmail,
            currentVersion: this.remittanceRequestDetails.personDetails.currentVersion,
            mobileNoList: this.bMobileList,
            photoIdList: this.photoIdListForInsertUpdate,
            presentAddress: bPresentAddress,
            permanentAddress: bPresentAddress,
            photoContent: this.userPhoto,
            fingerprint: this.fingerPrintData,
            isNewRecipientSocialMedia: (this.isNewRecipientSocialMedia == '' || this.isNewRecipientSocialMedia == 'No') ? 'No' : 'Yes',
            socialMediaJson: bSocialMediaJson
        };

        /*senderDetails*/
        let sSocialMediaJson;
        if (this.sSocialMediaFlag) {
            sSocialMediaJson = {
                facebook: this.sFacebookId,
                email: this.sEmail,
                imo: this.sImo ? 'Yes' : 'No',
                viber: this.sViber ? 'Yes' : 'No',
                whatsapp: this.sWhatsapp ? 'Yes' : 'No',
                smartphoneUser: this.sSmartPhone ? 'Yes' : 'No',
                internetUser: this.sInternet ? 'Yes' : 'No'
            };
        }
        else {
            sSocialMediaJson = {
                facebook: this.sFacebookId,
                email: '',
                imo: 'No',
                viber: 'No',
                whatsapp: 'No',
                smartphoneUser: 'No',
                internetUser: 'No'
            };
        }
        let sPermanentAddress = {
            addressLine1: this.senderFormGroup.get('sPermanentAddress').value,
            addressLine2: this.senderFormGroup.get('sPermanentAddress').value,
            addressLine3: this.senderFormGroup.get('sPermanentAddress').value,
            postalCode: this.senderFormGroup.get('sPermanentAddress').value,
            divisionName: this.senderFormGroup.get('sDivision').value == '' ? '' : this.getSSelectedDivisionName(this.senderFormGroup.get('sDivision').value),
            divisionGeocode: this.senderFormGroup.get('sDivision').value,
            districtName: this.senderFormGroup.get('sDistrict').value == '' ? '' : this.getSSelectedDistrictName(this.senderFormGroup.get('sDistrict').value),
            districtGeocode: this.senderFormGroup.get('sDistrict').value,
            upazillaName: this.senderFormGroup.get('sUpazilla').value == '' ? '' : this.getSSelectedUpazillaName(this.senderFormGroup.get('sUpazilla').value),
            upazillaGeocode: this.senderFormGroup.get('sUpazilla').value,
            unionName: this.senderFormGroup.get('sUnion').value == '' ? '' : this.getSSelectedUnionName(this.senderFormGroup.get('sUnion').value),
            unionGeocode: this.senderFormGroup.get('sUnion').value,
            country: 'BANGLADESH'
        };

        this.senderDetails = {
            oid: this.senderOid,
            fullName: this.senderFormGroup.get('sName').value,
            gender: this.senderFormGroup.get('sGenderType').value,
            mobileNoOverseas: this.senderFormGroup.get('sMobile').value,
            residenceCity: this.senderFormGroup.get('sCity').value,
            residenceCountry: this.senderFormGroup.get('sCountry').value,
            permanentAddress: sPermanentAddress,
            isNewSenderSocialMedia: (this.isNewSenderSocialMedia == '' || this.isNewSenderSocialMedia == 'No') ? 'No' : 'Yes',
            socialMediaJson: sSocialMediaJson
        };

        console.log(this.remittanceInformation, this.recipientDetails, this.senderDetails)

        this.bsrInformationService.saveEditDetail(this.isRecipientDetailUpdate, this.isSenderDetailUpdate,
            this.remittanceInformation, this.recipientDetails, this.senderDetails)
            .subscribe(resData => {
                console.log(resData);
                if (resData != null && resData.header.responseCode == '200') {
                    this.location.back();
                }
                else {

                }
            },
            err => {
                console.log(err);
            });

    }
    goBackMainMenu() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to back?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.location.back();
            },
            reject: () => {
            }
        });
    }
    OnIFRReviewClick() {
        this.hideIFRRequestDiv = true;
        this.hideIFRReviewDiv = false;
    }
    goBackIFRMenu() {
        this.hideIFRRequestDiv = false;
        this.hideIFRReviewDiv = true;
        this.printBtnText = 'Print';
        this.showMatchBtn = false;
        this.showMatchAmountControl = false;
        this.showSubmitBtn = false;
        this.showCancelBtn = false;
        this.showMatchBtn = false;
        this.inputAmount = null;
        this.verifyAmount = null;
    }
    OnIFRPrintClick() {
        this.printBtnText = 'Re-print';
        window.print();
        if (!this.showSubmitBtn) {
            this.showMatchBtn = true;
        }
    }
    OnIFRMatchClick() {
        this.showMatchBtn = false;
        this.showMatchAmountControl = true;
        this.showSubmitBtn = true;
        this.showCancelBtn = true;
    }
    OnIFRCancelClick() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to cancel request?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.location.back();
            },
            reject: () => {
            }
        });
    }
}