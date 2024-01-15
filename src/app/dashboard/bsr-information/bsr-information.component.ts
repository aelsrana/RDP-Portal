import { LoaderService } from 'src/app/shared/services/loader.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, NgModel } from '@angular/forms';
import { SelectItem, Message } from 'primeng/api';
import { routerTransition } from '../../router.animations';
import { BsrInformationService } from './bsr-information.service';
import { IFR_IMAGE_PATH, JPG_EXTENTION } from '../../shared/constant/constant';
import { ConfirmationService } from 'primeng/api';
import { Location } from '@angular/common';
import { ISocialMediaJson, IMobile, IPhotoId, ISender, ISPermanentAddress, IRecipientDetails, IRemittanceInformation, ISenderDetails, IFingerprintData } from './bsr-information.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { webSocketAddress } from '../../shared/constant/api';
import { element } from 'protractor';
import { byteArrayToHexString } from '../../shared/helper/util.helper';
import { AuthService } from '../../shared/guard/index';
//import { parse } from 'path';

declare var $: any;

@Component({
    selector: 'app-bsr-information',
    templateUrl: './bsr-information.component.html',
    styleUrls: ['./bsr-information.component.css'],
    animations: [routerTransition()]
})
export class BsrInformationComponent implements OnInit {

    /*------------  -------------*/
    public showSearch: boolean = true;
    @ViewChild('appSearchRecipient') appSearchRecipient: any;
    //@ViewChild('beneficiaryFormGroup') beneficiaryFormGroup: any;
    public currentDateTime = new Date();
    public userName: string = '';

    public isNewPerson; isLoading: boolean = true;

    public amount: number = null;
    public metadata:any;
    public percentageValue:number;

    public showPhotoDiv: boolean = false;
    public showSenderDiv: boolean = false;
    public showMobileModal: boolean = false;
    public showSendOTPModal: boolean = false;
    public showVerifyOTPModal: boolean = false;

    public senderAddBtnDisable: boolean = true;
    public capAddBtnDisable: boolean = false;

    public hideSearchDiv: boolean = false;
    //// hideBeneficiaryDiv set true/////
    public hideBeneficiaryDiv: boolean = false;
    public hideCaptureDiv: boolean = false;
    public hideSenderDiv: boolean = true;
    public hideRemittanceDiv: boolean = true;

    /*---------------------------------------IFR Submit-----------------------------*/
    public rejectConfirmationModal: boolean = false;
    private newPerson: string = '';
    private isNewSender: string = '';
    private isSenderDetailUpdate: string = '';
    private isRecipientDetailUpdate: string = 'Yes';
    private remittanceInformation: IRemittanceInformation;
    private senderDetails: ISenderDetails;
    private recipientDetails: IRecipientDetails;
    private personOid: string = '';
    private remittanceOid: string = '';
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
    public mobileModalClosable: boolean = true;

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
    public fpDataFlag: string = 'No';
    public fingerScanFlag: boolean = false;
    public showFingerScanModal: boolean = false;
    private ws: any;

    /*------------ Beneficiary: Present Address -------------*/
    public bPresentAddressDialog: boolean = false;

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
    //@ViewChild('photoIdNoNgModel') photoIdNoNgModel: NgModel;
    @ViewChild('verifyAmountNgModel') verifyAmountNgModel: NgModel;
    public photoIdNoNgModel: NgModel;
    @ViewChild('photoIdNoNgModel') set content(content: NgModel) {
        this.photoIdNoNgModel = content;
        this.cdr.detectChanges();
    }
    public showPhotoAddBtn: boolean = true;
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
    public isSelectedIdNotNID: boolean = true;
    public isNIDECVerified: boolean = false;

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
    public isNewPhotoIdAvailable: boolean = false;
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
    public personNIDVerification: string = "Unverified";
    public remittanceNIDVerification: string = "Unverified";


    /*--------------Cancel IFR--------------*/
    public otherReason: boolean = false;
    public rejectReason: string[] = [];
    public reasonText: string = '';

    constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private bsrInformationService: BsrInformationService, private confirmationService: ConfirmationService,
        private location: Location, private authService: AuthService, private loaderService: LoaderService) {
        this.userName = (this.authService.getAuthInfo() as any).userName;
        let self = this;

        this.ws = new WebSocket(webSocketAddress);
        this.ws.onmessage = function (event) {
            var json = JSON.parse(event.data);

            if (json.ResultType === "ImageData") {

            }
            else if (json.ResultType === "ScanResult") {
                if (self.rtFpScanBtnCLick) {
                    //self.rtFpCanvas = true;
                    //appService.setRtFpScaneData(json.ScanResult);
                    self.rt = byteArrayToHexString((json.ScanResult).Template);
                    var c = document.getElementById("rtCanvasImg");
                    (c as any).width = json.ScanResult.ImageWidth;
                    (c as any).height = json.ScanResult.ImageHeight;
                    var ctx = (c as any).getContext("2d");

                    var imgData = ctx.createImageData(json.ScanResult.ImageWidth, json.ScanResult.ImageHeight);
                    var pixels = imgData.data;

                    for (var i = 0; i < json.ScanResult.ImageData.length; i++) {
                        pixels[4 * i] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 1] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 2] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 3] = 255;
                    }

                    imgData.data.set(pixels);
                    ctx.putImageData(imgData, 0, 0);
                    self.loaderService.display(false);
                    self.isEnbleRtScanBtn = false;
                }
                if (self.riFpScanBtnCLick) {
                    //self.riFpCanvas = true;
                    // appService.setRiFpScaneData(json.ScanResult);
                    self.ri = byteArrayToHexString((json.ScanResult).Template);
                    var c = document.getElementById("riCanvasImg");
                    (c as any).width = json.ScanResult.ImageWidth;
                    (c as any).height = json.ScanResult.ImageHeight;
                    var ctx = (c as any).getContext("2d");

                    var imgData = ctx.createImageData(json.ScanResult.ImageWidth, json.ScanResult.ImageHeight);
                    var pixels = imgData.data;

                    for (var i = 0; i < json.ScanResult.ImageData.length; i++) {
                        pixels[4 * i] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 1] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 2] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 3] = 255;
                    }

                    imgData.data.set(pixels);
                    ctx.putImageData(imgData, 0, 0);
                    self.loaderService.display(false);
                    self.isEnbleRiScanBtn = false;
                }
                if (self.ltFpScanBtnCLick) {
                    //self.ltFpCanvas = true;
                    //appService.setLtFpScaneData(json.ScanResult);
                    self.lt = byteArrayToHexString((json.ScanResult).Template);
                    var c = document.getElementById("ltCanvasImg");
                    (c as any).width = json.ScanResult.ImageWidth;
                    (c as any).height = json.ScanResult.ImageHeight;
                    var ctx = (c as any).getContext("2d");

                    var imgData = ctx.createImageData(json.ScanResult.ImageWidth, json.ScanResult.ImageHeight);
                    var pixels = imgData.data;

                    for (var i = 0; i < json.ScanResult.ImageData.length; i++) {
                        pixels[4 * i] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 1] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 2] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 3] = 255;
                    }

                    imgData.data.set(pixels);
                    ctx.putImageData(imgData, 0, 0);
                    self.loaderService.display(false);
                    self.isEnbleLtScanBtn = false;
                }
                if (self.liFpScanBtnCLick) {
                    //self.liFpCanvas = true;
                    //appService.setLiFpScaneData(json.ScanResult);
                    self.li = byteArrayToHexString((json.ScanResult).Template);
                    var c = document.getElementById("liCanvasImg");
                    (c as any).width = json.ScanResult.ImageWidth;
                    (c as any).height = json.ScanResult.ImageHeight;
                    var ctx = (c as any).getContext("2d");

                    var imgData = ctx.createImageData(json.ScanResult.ImageWidth, json.ScanResult.ImageHeight);
                    var pixels = imgData.data;

                    for (var i = 0; i < json.ScanResult.ImageData.length; i++) {
                        pixels[4 * i] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 1] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 2] = json.ScanResult.ImageData[i];
                        pixels[4 * i + 3] = 255;
                    }

                    imgData.data.set(pixels);
                    ctx.putImageData(imgData, 0, 0);
                    self.loaderService.display(false);
                    self.isEnbleLiScanBtn = false;
                    self.isEnbleLiVerifyBtn = true;
                }
            }
            else if (json.ResultType === "Error") {
                self.loaderService.display(false);
                self.growlMessage = [];
                self.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: json.Error });
            }
            else if (json.ResultType === "VerifyResult") {
                if (self.rtFpScanBtnCLick) {
                    if (json.VerifyResult.AuthenticationScore > 5000) {
                        self.growlMessage = [];
                        self.growlMessage.push({ severity: 'success', summary: 'Success Message', detail: "Finger print verification successful" });
                        //setTimeout(() => self.clearGrowlMessage(), 2000);
                        //alert("Finger print verification successful");
                        self.rtVarify = true;
                        self.rtScan = false;
                        self.rtFpDiv = false;
                        self.riFpDiv = true;
                        self.loaderService.display(false);
                    }
                    else {
                        self.growlMessage = [];
                        self.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Finger print not match" });
                        //setTimeout(() => self.clearGrowlMessage(), 3000);
                        //alert("Finger print not match");
                        self.loaderService.display(false);
                        //self.rtVarify = false;
                    }

                }
                if (self.riFpScanBtnCLick) {
                    if (json.VerifyResult.AuthenticationScore > 5000) {
                        self.growlMessage = [];
                        self.growlMessage.push({ severity: 'success', summary: 'Success Message', detail: "Finger print verification successful" });
                        //setTimeout(() => self.clearGrowlMessage(), 2000);
                        //alert("Finger print verification successful");
                        self.riVarify = true;
                        self.riScan = false;
                        self.riFpDiv = false;
                        self.ltFpDiv = true;
                        self.loaderService.display(false);
                    }
                    else {
                        self.growlMessage = [];
                        self.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Finger print not match" });
                        //setTimeout(() => self.clearGrowlMessage(), 3000);
                        self.loaderService.display(false);
                        //self.riVarify = false;
                    }
                }
                if (self.ltFpScanBtnCLick) {
                    if (json.VerifyResult.AuthenticationScore > 5000) {
                        self.growlMessage = [];
                        self.growlMessage.push({ severity: 'success', summary: 'Success Message', detail: "Finger print verification successful" });
                        //setTimeout(() => self.clearGrowlMessage(), 2000);
                        self.ltVarify = true;
                        self.ltScan = false;
                        self.ltFpDiv = false;
                        self.liFpDiv = true;
                        self.loaderService.display(false);
                    }
                    else {
                        self.growlMessage = [];
                        self.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Finger print not match" });
                        //setTimeout(() => self.clearGrowlMessage(), 3000);
                        self.loaderService.display(false);
                        //self.ltVarify = false;
                    }
                }
                if (self.liFpScanBtnCLick) {
                    if (json.VerifyResult.AuthenticationScore > 5000) {
                        self.growlMessage = [];
                        self.growlMessage.push({ severity: 'success', summary: 'Success Message', detail: "Finger print verification successful" });
                        //setTimeout(() => self.clearGrowlMessage(), 2000);
                        self.liVarify = true;
                        self.liScan = false;
                        self.liFpNot = false;
                        self.libtnDisable = true;
                        self.loaderService.display(false);
                        self.isEnbleLiVerifyBtn = false;
                    }
                    else {
                        self.growlMessage = [];
                        self.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Finger print not match" });
                        //setTimeout(() => self.clearGrowlMessage(), 3000);
                        self.loaderService.display(false);
                        //self.liVarify = false;
                    }
                }
            }
            else if (json.ResultType === "Error") {
                self.growlMessage = [];
                self.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: json.Error });
                self.loaderService.display(false);
            }
            else if (json.ResultType === "VerifyResult") {
                //self.loaderService.display(false);
            }
            else if (json.ResultType === "VerifyImageData") {
                //self.loaderService.display(false);
            }
            else if (json.ResultType === "ConnectionStatus") {
                self.growlMessage = [];
                self.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: json.status });
                self.loaderService.display(false);
            }
        }
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
        this.bsrInformationService.getExchangeHouseList()
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.allExchangeHouseLists = resData.body.data;
                    this.filteredExchangeHouseLists = this.allExchangeHouseLists;
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
                    this.beneficiaryFormGroup.patchValue({ bDivision: '' });
                    this.senderFormGroup.patchValue({ sDivision: '' });
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
            this.getAllowedPercentage();
        this.disableSenderControls();
    }
    onBeneficiaryAdd($event) {
        this.showSearch = false;
        this.isNewPerson = true;
        this.hideBeneficiaryDiv = false;
        this.hideSearchDiv = true;
        this.addNewMobileNo();
        this.bMobileNumber = $event;
        this.mobileValidSign = true;
        this.mobileModalClosable = false;
        if (this.appSearchRecipient.recipientNid != "" && this.appSearchRecipient.nidValidSign == true) {
            if (this.appSearchRecipient.recipientNid.length === 10) {
                this.selectedPhotoId = "SmartNID";
            }
            else {
                this.selectedPhotoId = "NID";
            }
            this.photoIdNo = this.appSearchRecipient.recipientNid;
        }
        else if (this.appSearchRecipient.recipientPassport != "" && this.appSearchRecipient.passportValidSign == true) {
            this.selectedPhotoId = 'PassportNo';
            this.photoIdNo = this.appSearchRecipient.recipientPassport;
        }
        else if (this.appSearchRecipient.recipientDrivingLic != "") {
            this.selectedPhotoId = 'DrivingLicense';
            this.photoIdNo = this.appSearchRecipient.recipientDrivingLic;
        }
    }
    onBeneficiarySelect($event) {
        this.showSearch = false;
        this.isNewPerson = false;
        this.hideSearchDiv = true;
        if ($event.personDetails.mobileNoList.filter(a => a.mobileNo === this.appSearchRecipient.recipientMobile).length === 0) {
            this.addNewMobileNo();
            this.bMobileNumber = this.appSearchRecipient.recipientMobile;
            this.mobileValidSign = true;
            this.mobileModalClosable = false;
        }
        if ($event.personDetails.nidVerification) {
            this.personNIDVerification = $event.personDetails.nidVerification;
            this.remittanceNIDVerification = "Local";
            if ($event.personDetails.nidVerification == 'EC') {
                this.isNIDECVerified = true;
            }
            else {
                this.isNIDECVerified = true;
            }
        }
        this.personOid = $event.personOid;
        this.fpDataFlag = $event.fpDataFlag;
        this.fingerScanFlag = this.fpDataFlag === 'Yes' ? true : false;
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
        let presentAddress = $event.personDetails.presentAddress;

        if (presentAddress && presentAddress.divisionGeocode && presentAddress.divisionGeocode !== '') {
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
                //this.senderOid = this.senderList[0].oid;
                //if (this.senderList[0].socialMediaFlag == "Yes") {
                //    this.isNewSenderSocialMedia = 'No';
                //}
                //else {
                //    this.isNewSenderSocialMedia = '';
                //}
                let e = { data: this.selectedSender };
                this.onSNameRowSelect(e);
            }
        }

        // Beneficiary: Social Media data set
        if ($event.personDetails.socialMediaFlag == "Yes") {
            this.bSocialMediaFlag = true;
            this.isNewRecipientSocialMedia = 'No';
            this.bFacebookId = $event.personDetails.socialMediaJson.facebook;
            this.bEmail = $event.personDetails.socialMediaJson.email;
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
        this.mobileModalClosable = true;
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
        this.onOTPSkipClick();
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
        this.bDistrictLists = [];
        this.bUpazillaLists = [];
        this.bUnionLists = [];
        this.beneficiaryFormGroup.patchValue({ bDistrict: '' });
        this.bsrInformationService.getDistrictList(this.beneficiaryFormGroup.get('bDivision').value)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.bDistrictLists = resData.body.data;
                    //this.getBSelectedDivisionName(this.beneficiaryFormGroup.get('bDivision').value);
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
        this.beneficiaryFormGroup.patchValue({ bUpazilla: '' });
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
        this.beneficiaryFormGroup.patchValue({ bUnion: '' });
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

    /*---------------------- Beneficiary: Finger Print -----------------------*/
    scanFingerButtonClick() {
        if (this.fpDataFlag == 'No') {
            this.showFingerScanModal = true;
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'info', summary: 'Info Message', detail: "Finger print data already add." });
        }
    }
    onFingerCloseClick() {
        this.showFingerScanModal = false;
    }
    onFingerScanDoneClick() {
        this.showFingerScanModal = false;
        if (this.ri != '' && this.rt != '' && this.li != '' && this.lt != '') {
            this.fingerScanFlag = true;
        }
    }

    rtFpScan() {
        if (this.ws.readyState == 1) {
            this.rtFpScanBtnCLick = true;
            this.riFpScanBtnCLick = false;
            this.ltFpScanBtnCLick = false;
            this.liFpScanBtnCLick = false;
            this.ws.send("scan");
            this.rtFpCanvas = true;
            this.loaderService.display(true);
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Windows service connection error." });
        }
    }
    rtVarifyFp() {
        if (this.ws.readyState == 1) {
            this.ws.send("verify");
            this.loaderService.display(true);
            //this.rtVarify = true;
            //this.varifyCanvas = true;  
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Windows service connection error." });
        }
    }
    rtAbsentBtnCLick() {
        this.rt = "FINGER_NOT_PRESENT";
        this.rtFpNot = true;
        this.rtScan = false;
        this.rtFpDiv = false;
        this.riFpDiv = true;
    }

    riFpScan() {
        if (this.ws.readyState == 1) {
            this.rtFpScanBtnCLick = false;
            this.riFpScanBtnCLick = true;
            this.ltFpScanBtnCLick = false;
            this.liFpScanBtnCLick = false;
            this.ws.send("scan");
            this.riFpCanvas = true;
            this.loaderService.display(true);
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Windows service connection error." });
        }
    }
    riVarifyFp() {
        if (this.ws.readyState == 1) {
            this.ws.send("verify");
            this.loaderService.display(true);
            //this.rtVarify = true;
            //this.varifyCanvas = true;  
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Windows service connection error." });
        }
    }
    riAbsentBtnCLick() {
        this.ri = "FINGER_NOT_PRESENT";
        this.riScan = false;
        this.riFpNot = true;
        this.riFpDiv = false;
        this.ltFpDiv = true;
    }

    ltFpScan() {
        if (this.ws.readyState == 1) {
            this.rtFpScanBtnCLick = false;
            this.riFpScanBtnCLick = false;
            this.ltFpScanBtnCLick = true;
            this.liFpScanBtnCLick = false;
            this.ws.send("scan");
            this.ltFpCanvas = true;
            this.loaderService.display(true);
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Windows service connection error." });
        }
    }
    ltVarifyFp() {
        if (this.ws.readyState == 1) {
            this.ws.send("verify");
            this.loaderService.display(true);
            //this.rtVarify = true;
            //this.varifyCanvas = true;  
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Windows service connection error." });
        }
    }
    ltAbsentBtnCLick() {
        this.lt = "FINGER_NOT_PRESENT";
        this.ltFpDiv = false;
        this.liFpDiv = true;
        this.ltScan = false;
        this.ltFpNot = true;
    }

    liFpScan() {
        if (this.ws.readyState == 1) {
            this.rtFpScanBtnCLick = false;
            this.riFpScanBtnCLick = false;
            this.ltFpScanBtnCLick = false;
            this.liFpScanBtnCLick = true;
            this.ws.send("scan");
            this.liFpCanvas = true;
            this.loaderService.display(true);
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Windows service connection error." });
        }
    }
    liVarifyFp() {
        if (this.ws.readyState == 1) {
            this.ws.send("verify");
            this.loaderService.display(true);
            //this.rtVarify = true;
            //this.varifyCanvas = true;  
        }
        else {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: "Windows service connection error." });
        }
    }
    liAbsentBtnCLick() {
        if (this.rtVarify == false && this.riVarify == false && this.ltVarify == false && this.liVarify == false) {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'warn', summary: 'Warn Message', detail: "Must be scan this finger" });
            return false;
        }
        else {
            this.li = "FINGER_NOT_PRESENT";
            this.liScan = false;
            this.liFpNot = true;
            this.libtnDisable = true;
            this.isEnbleLiScanBtn = false;
        }

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
            this.photoIdNoTooltip = '1 or 2 letter and 7 digit';
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
        if ($event.data.photoIdType == 'SmartNID' || $event.data.photoIdType == 'NID') {
            this.isSelectedIdNotNID = false;
        }
        else {
            this.isSelectedIdNotNID = true;
        }
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
        this.isSelectedIdNotNID = true;
        this.photoIdFrontPhotoCapture = false;
        this.photoIdBackPhotoCapture = false;
        this.photoIdFrontPhoto = "";
        this.photoIdBackPhoto = "";
        this.showUserPhotoUploadBtn = false;
        this.showUserPhotoUploadBtn = false;
    }
    onPhotoAddClick() {
        if (((this.appSearchRecipient.recipientNid != "" && this.appSearchRecipient.nidValidSign == true)
            || (this.appSearchRecipient.recipientPassport != "" && this.appSearchRecipient.passportValidSign == true)
            || this.appSearchRecipient.recipientDrivingLic != "") && this.photoIdList.length === 0) {

            this.isNewPhotoIdAvailable = true;
        }
        else {
            this.isNewPhotoIdAvailable = false;
        }
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
        if (!this.isPhotoIdInEditMode && !this.isNewPhotoIdAvailable) {
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
        if (this.selectedPhotoId == 'NID' || this.selectedPhotoId == '') {
            this.isSelectedIdNotNID = false;
        }
        else {
            this.isSelectedIdNotNID = true;
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
    onECVerifyClick() {
        this.isNIDECVerified = true;
        this.personNIDVerification = 'EC';
        this.remittanceNIDVerification = 'EC';
        window.open('https://services.nidw.gov.bd/voter_center');
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
            this.sEmail = $event.data.socialMediaJson.email;
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
            //this.sEmail = '';
            this.sEmail = '';
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
            //this.sEmail = $event.socialMediaJson.email;
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
        this.hideRemittanceDiv = true;
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
        this.sEmail = '';
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
                        //email: this.sEmail,
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
                        //email: this.sEmail,
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
                    //email: this.sEmail,
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
        this.sDistrictLists = [];
        this.sUpazillaLists = [];
        this.sUnionLists = [];
        this.senderFormGroup.patchValue({ sDistrict: '' });
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
                    this.sDivisionLists = [];
                    this.sUpazillaLists = [];
                    this.sUnionLists = [];
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
        this.senderFormGroup.patchValue({ sUpazilla: '' });
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
                    this.sUpazillaLists = [];
                    this.sUnionLists = [];
                    this.senderFormGroup.patchValue({ sUpazilla: '' });
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
        this.senderFormGroup.patchValue({ sUnion: '' });
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
            //this.filteredExchangeHouseLists = filterExchangeList;
            this.filteredExchangeHouseLists = this.allExchangeHouseLists;
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
    OnIFRReviewClick() {

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
                oid: this.remittanceOid,
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
            ri: (this.ri == '' || this.ri == 'FINGER_NOT_PRESENT') ? {} : { '1': this.ri },
            rt: (this.rt == '' || this.rt == 'FINGER_NOT_PRESENT') ? {} : { '1': this.rt },
            rm: {},
            rr: {},
            rp: {},
            lt: (this.lt == '' || this.lt == 'FINGER_NOT_PRESENT') ? {} : { '1': this.lt },
            li: (this.li == '' || this.li == 'FINGER_NOT_PRESENT') ? {} : { '1': this.li },
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
            currentVersion:"1",// for new person always 1
            mobileNoList: this.bMobileList,
            photoIdList: this.photoIdListForInsertUpdate,
            presentAddress: bPresentAddress,
            permanentAddress: bPresentAddress,
            photoContent: this.userPhoto,
            fingerprint: (this.ri == '' && this.rt == '' && this.li == '' && this.lt == '') ? null : this.fingerPrintData,
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
                //email: this.sEmail,
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
        if (this.newPerson == "Yes") {
            this.isRecipientDetailUpdate = 'No';
        }
        this.loaderService.display(true);
        this.bsrInformationService.saveDetail(this.newPerson, this.isRecipientDetailUpdate, this.isNewSender, this.isSenderDetailUpdate,
            this.remittanceInformation, this.recipientDetails, this.senderDetails)
            .subscribe(resData => {
                if (resData != null && resData.header.responseCode == '200') {
                    this.loaderService.display(false);
                    this.personOid = resData.body.personOid;
                    this.senderOid = resData.body.senderOid;
                    this.remittanceOid = resData.body.remittanceOid;
                    this.isNewPerson = false;
                    if (this.selectedSender.senderAddFlag) {
                        this.selectedSender.senderAddFlag = "No";
                    }
                    if (this.selectedSender.senderEditFlag) {
                        this.selectedSender.senderEditFlag = "No";
                    }
                    if (this.isNewSenderSocialMedia === 'Yes') {
                        this.isNewSenderSocialMedia = 'No'
                    }
                    if (this.isNewRecipientSocialMedia === 'Yes') {
                        this.isNewRecipientSocialMedia = 'No';
                    }
                    //this.hideIFRRequestDiv = false;
                    //this.hideIFRReviewDiv = false;
                    //this.hideSearchDiv = false;
                    //this.appSearchRecipient.recipientMobile = "";
                    //this.appSearchRecipient.recipientNid = "";
                    //this.appSearchRecipient.recipientPassport = "";
                    //this.appSearchRecipient.recipientDrivingLic = "";
                    //this.appSearchRecipient.nidValidSign = false;
                    //this.appSearchRecipient.passportValidSign = false;
                    ////this.setSearchInitialState();
                    //this.location.back();
                    //this.resetIFR();
                    this.hideIFRRequestDiv = true;
                    this.hideIFRReviewDiv = false;
                }
                else {
                    this.loaderService.display(false);
                    this.growlMessage = [];
                    this.growlMessage.push({ severity: 'error', summary: '', detail: 'Something wrong on server' });
                }
            },
            err => {
                this.loaderService.display(false);
                this.growlMessage = [];
                this.growlMessage.push({ severity: 'error', summary: '', detail: 'Something wrong on server' });
                console.log(err);
            });

    }
    //onIFRClearClick() {
    //this.confirmationService.confirm({
    //    message: 'Are you sure that you want to clear all data and search again?',
    //    header: 'Confirmation',
    //    icon: 'pi pi-exclamation-triangle',
    //    accept: () => {
    //        this.setSearchInitialState();
    //        this.resetIFR();
    //    },
    //    reject: () => {
    //    }
    //});
    //}
    setSearchInitialState() {
        this.appSearchRecipient.recipientMobile = "";
        this.appSearchRecipient.recipientNid = "";
        this.appSearchRecipient.recipientPassport = "";
        this.appSearchRecipient.recipientDrivingLic = "";
        this.appSearchRecipient.mobileValidSign = false;
        this.appSearchRecipient.nidValidSign = false;
        this.appSearchRecipient.passportValidSign = false;
        this.appSearchRecipient.personList = null;
        this.appSearchRecipient.showAdvancedSearchOptions = false;
        setTimeout(() => $("#recipientMobile").focus(), 0);
    }
    resetIFR() {
        /*------------  -------------*/
        this.personOid = '';
        this.senderOid = '';
        this.inputAmount = null;
        this.verifyAmount = null;
        this.printBtnText = "Print";
        this.reasonText = '';
        this.rejectReason = [];

        this.isNewRecipientSocialMedia = '';
        this.isNewSenderSocialMedia = '';

        this.amount = null;
        this.showPhotoDiv = false;
        this.showSenderDiv = false;
        this.showMobileModal = false;
        this.showSendOTPModal = false;
        this.showVerifyOTPModal = false;
        this.senderAddBtnDisable = true;
        this.capAddBtnDisable = false;
        this.hideBeneficiaryDiv = true;
        this.hideCaptureDiv = false;
        this.hideSenderDiv = true;
        this.hideRemittanceDiv = true;
        /*------------ Beneficiary: Mobile Modal -------------*/
        this.bMobileNumber = '';
        this.bConfirmMobileNumber = '';
        this.bOTPCode = '';
        this.mobileValidSign = false;
        this.confirmMobileValidSign = false;
        this.bMobileList = [];
        this.isBMobileSelected = false;
        this.sendOTPByServer = '';
        this.selectedBMobile = null;
        this.mobileModalClosable = true;
        /*------------ Beneficiary: Gender Types -------------*/
        this.genderTypes = [
            { label: '', value: 'Male', icon: 'fa fa-fw fa-male' },
            { label: '', value: 'Female', icon: 'fa fa-fw fa-female' },
            { label: '', value: 'Other', icon: 'fa fa-fw fa-genderless' }
        ];
        /*------------ Beneficiary: Social Media -------------*/
        this.bSocialMediaFlag = false;
        this.bSocialMediaModal = false;
        this.bFacebookId = '';
        //this.bEmail = '';
        this.bInternet = false;
        this.bImo = false;
        this.bViber = false;
        this.bWhatsapp = false;
        this.bSmartPhone = false;
        /*------------ Beneficiary: GEO Code -------------*/
        this.bDivisionLists = [];
        this.bDistrictLists = [];
        this.bUpazillaLists = [];
        this.bUnionLists = [];
        /*------------ Sender -------------*/
        this.senderList = [];
        this.senderListForInsertUpdate = [];
        this.selectedSender = null;
        this.showSenderList = false;
        this.showInputSenderName = false;
        this.showInputSenderControls = false;
        this.isDisableSenderControl = true;
        this.showSenderMendatoryDiv = false;
        this.isSenderEditMode = false;
        this.isSenderSelected = false;
        this.editSenderId = '';
        this.showSenderAddBtn = true;
        /*------------ Sender: Social Media -------------*/
        this.sSocialMediaFlag = false;
        this.sSocialMediaModal = false;
        this.sFacebookId = '';
        this.sEmail = '';
        this.sInternet = false;
        this.sImo = false;
        this.sViber = false;
        this.sWhatsapp = false;
        this.sSmartPhone = false;
        /*------------ Sender: GEO Code -------------*/
        this.sDivisionLists = [];
        this.sDistrictLists = [];
        this.sUpazillaLists = [];
        this.sUnionLists = [];
        /*------------ Remittance -------------*/
        this.allExchangeHouseLists = [];
        this.filteredExchangeHouseLists = [];
        this.pinNumber = '';
        this.selectedexchangeHouse = '';
        this.disableTTNumber = true;
        /*-------------- Photo Div ----------------*/
        this.showPhotoAddBtn = true;
        this.showPhotoDivClrDoneClearBtn = true;
        this.viewSeletedPhotoIdDiv = false;
        this.selectedPhotoId = '';
        this.photoIdNo = '';
        this.seletedPhotoIdText = 'Photo ID';
        this.imgPath = IFR_IMAGE_PATH;
        this.photoIdTypes = [{ 'value': '', 'text': 'Choose ID' },
        { 'value': 'SmartNID', 'text': 'Smart NID' },
        { 'value': 'NID', 'text': 'NID' },
        { 'value': 'PassportNo', 'text': 'Passport No.' },
        { 'value': 'DrivingLicense', 'text': 'Driving License' }];
        this.photoIdPattern = '';
        this.photoIdNoTooltip = '';
        this.photoIdMaxLength = 0;
        /*------------ Customer Photo -------------*/
        this.photoIdList = [];
        this.photoIdListForInsertUpdate = [];
        this.selectedCapturedPhotoId = null;
        this.isPhotoIdSelected = false;
        this.userPhotoDialog = false;
        this.userPhotoCapture = false;
        this.userPhoto = '';
        this.customerPhotoModalDialog = false;
        this.showUserPhotoUploadBtn = true;
        this.isUserPhotoAvailable = false;
        this.isPhotoIdInEditMode = false;
        this.isNewPhotoIdAvailable = false;
        this.photoIdInViewMode = true;
        /*------------ Photo Id Front -------------*/
        this.photoIdFrontDialog = false;
        this.photoIdFrontPhotoCapture = false;
        this.photoIdFrontPhoto = '';
        this.frontPhotoModalDialog = false;
        this.showPhotoIdCaptureUploadBtn = true;
        /*------------ Photo Id Back -------------*/
        this.photoIdBackDialog = false;
        this.photoIdBackPhotoCapture = false;
        this.photoIdBackPhoto = '';
        this.backPhotoModalDialog = false;
        /*------------On Submit Clear-----------*/
        this.newPerson = '';
        this.isNewSender = '';
        this.isSenderDetailUpdate = '';
        this.isRecipientDetailUpdate = 'Yes';
        this.remittanceInformation = null;
        this.senderDetails = null;
        this.recipientDetails = null;

        this.isNewPerson = true;
        /*------------ Message -------------*/
        //this.growlMessage = [];
        /*------------ Event -------------*/
        this.ngOnInit();
        this.goBackIFRMenu();

        /*-------------------Finger Print Data--------------------*/

        this.fingerScanFlag = false;
        this.showFingerScanModal = false;
        this.fpDataFlag = 'No';

        this.defaultFP = "";
        this.rt = "";
        this.ri = "";
        this.lt = "";
        this.li = "";

        this.lm = "FINGER_NOT_PRESENT";
        this.lp = "FINGER_NOT_PRESENT";
        this.lr = "FINGER_NOT_PRESENT";
        this.rm = "FINGER_NOT_PRESENT";
        this.rp = "FINGER_NOT_PRESENT";
        this.rr = "FINGER_NOT_PRESENT";

        this.rtFpDiv = true;
        this.rtVarify = false;
        this.rtScan = true;
        this.rtFpNot = false;

        this.riFpDiv = false;
        this.riScan = true;
        this.riFpNot = false;
        this.riVarify = false;


        this.ltFpDiv = false;
        this.ltScan = true;
        this.ltFpNot = false;
        this.ltVarify = false;

        this.liFpDiv = false;
        this.liScan = true;
        this.liFpNot = false;
        this.liVarify = false;


        this.rtFpCanvas = false;
        this.riFpCanvas = false;
        this.ltFpCanvas = false;
        this.liFpCanvas = false;

        this.libtnDisable = false;

        this.isEnbleRtScanBtn = true;
        this.isEnbleRiScanBtn = true;
        this.isEnbleLtScanBtn = true;
        this.isEnbleLiScanBtn = true;
        this.isEnbleLiVerifyBtn = false;

        this.rtFpScanBtnCLick = false;
        this.riFpScanBtnCLick = false;
        this.ltFpScanBtnCLick = false;
        this.liFpScanBtnCLick = false;

        this.bPresentAddressDialog = false;

        this.showSearch = true;
    }
    goBackOnSearch() {
        //this.confirmationService.confirm({
        //    message: 'Are you sure that you want to back?',
        //    header: 'Confirmation',
        //    icon: 'pi pi-exclamation-triangle',
        //    accept: () => {
        //        this.location.back();
        //    },
        //    reject: () => {
        //    }
        //});
        this.confirmationService.confirm({
            message: 'Are you sure that you want to back?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.setSearchInitialState();
                this.resetIFR();
            },
            reject: () => {
            }
        });
    }
    //OnIFRReviewClick() {
    //    this.hideIFRRequestDiv = true;
    //    this.hideIFRReviewDiv = false;
    //}

    getPercentageChange(inputAmount, actualAmount) {
        var differenceBetweenAmount = parseFloat(inputAmount) - parseFloat(actualAmount);
        var percentageChange = (Math.abs(differenceBetweenAmount) / inputAmount) * 100;
        if (percentageChange > this.percentageValue) {
            this.growlMessage = [];
            this.growlMessage.push({ severity: 'error', summary: '', detail: 'Two amount difference must be less then '+this.percentageValue+' Percent' });
            return false;
        }
        else {
            return true;
        }
    }
    OnIFRSubmitClick() {
        if (this.getPercentageChange(this.removeAllComaFromAmount(this.amount), this.removeAllComaFromAmount(this.verifyAmount))) {
            this.loaderService.display(true);
            this.bsrInformationService.requestSubmit(this.remittanceOid, this.removeAllComaFromAmount(this.verifyAmount))
                .subscribe(resData => {
                    if (resData != null && resData.header.responseCode == '200') {
                        this.loaderService.display(false);
                        //this.growlMessage = [];
                        //this.growlMessage.push({ severity: 'success', summary: '', detail: 'Request submit successfull.' });
                        console.log(resData);
                        //this.hideIFRRequestDiv = false;
                        //this.hideIFRReviewDiv = false;
                        //this.hideSearchDiv = false;
                        //this.appSearchRecipient.recipientMobile = "";
                        //this.appSearchRecipient.recipientNid = "";
                        //this.appSearchRecipient.recipientPassport = "";
                        //this.appSearchRecipient.recipientDrivingLic = "";
                        //this.appSearchRecipient.nidValidSign = false;
                        //this.appSearchRecipient.passportValidSign = false;
                        //this.setSearchInitialState();
                        this.location.back();
                        this.resetIFR();
                    }
                    else {
                        this.loaderService.display(false);
                        this.growlMessage = [];
                        this.growlMessage.push({ severity: 'error', summary: '', detail: resData.header.responseMessage });
                    }
                },
                err => {
                    this.loaderService.display(false);
                    this.growlMessage = [];
                    this.growlMessage.push({ severity: 'error', summary: '', detail: 'Something wrong on server' });
                    console.log(err);
                });
        }
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
        this.reasonText = '';
        this.rejectReason = [];
        this.otherReason = false;
    }
    OnIFRPrintClick() {
        this.printBtnText = 'Re-print';
        this.bsrInformationService.printAck(this.remittanceOid)
            .subscribe(resData => {
                console.log(resData);
                if (resData != null && resData.header.responseCode == '200') {

                }
                else {
                    this.growlMessage = [];
                    this.growlMessage.push({ severity: 'error', summary: '', detail: resData.header.responseMessage });
                }
            },
            err => {
                this.loaderService.display(false);
                this.growlMessage = [];
                this.growlMessage.push({ severity: 'error', summary: '', detail: 'Something wrong on server' });
                console.log(err);
            });

        window.print();
        if (!this.showSubmitBtn) {
            this.showMatchBtn = true;
        }
    }
    OnIFRMatchClick() {
        this.loaderService.display(true);
        this.bsrInformationService.matchAck(this.remittanceOid)
            .subscribe(resData => {
                console.log(resData);
                if (resData != null && resData.header.responseCode == '200') {
                    console.log(resData);
                    this.loaderService.display(false);
                    this.showMatchBtn = false;
                    this.showMatchAmountControl = true;
                    this.showSubmitBtn = true;
                    this.showCancelBtn = true;
                }
                else {
                    this.loaderService.display(false);
                    this.growlMessage = [];
                    this.growlMessage.push({ severity: 'error', summary: '', detail: resData.header.responseMessage });
                }
            },
            err => {
                this.loaderService.display(false);
                this.growlMessage = [];
                this.growlMessage.push({ severity: 'error', summary: '', detail: 'Something wrong on server' });
                console.log(err);
            });

    }
    OnIFRRejectClick() {
        this.rejectConfirmationModal = true;
        this.rejectReason = [];
        this.otherReason = false;
        this.reasonText = '';
        //this.confirmationService.confirm({
        //    message: 'Are you sure that you want to cancel request?',
        //    header: 'Confirmation',
        //    icon: 'pi pi-exclamation-triangle',
        //    accept: () => {
        //        this.location.back();
        //    },
        //    reject: () => {
        //    }
        //});
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
        this.bsrInformationService.requestReject(this.remittanceOid, rejectionCause)
            .subscribe(resData => {
                console.log(resData);
                if (resData != null && resData.header.responseCode == '200') {
                    this.loaderService.display(false);
                    this.location.back();
                }
                else {
                    this.loaderService.display(false);
                    this.growlMessage = [];
                    this.growlMessage.push({ severity: 'error', summary: '', detail: resData.header.responseMessage });
                }
            },
            err => {
                this.loaderService.display(false);
                this.growlMessage = [];
                this.growlMessage.push({ severity: 'error', summary: '', detail: 'Something wrong on server' });
                console.log(err);
            });
    }
    onRejectNoClick() {
        this.rejectConfirmationModal = false;
    }
    ngOnDestroy() {
        this.ws.close();
    }

    getAllowedPercentage(){
        this.bsrInformationService.getMetaProperty().subscribe(resData => {
            if (resData != null && resData.header.responseCode == '200') {
                this.metadata = resData['body']['data'];
                if( this.metadata){
                    this.metadata.forEach(element => {
                        if(element.propertyId =='101'){
                            this.percentageValue = JSON.parse(element.valueJson)['AllowedPercentage'][0].value;
                        }
                    });
                }
                
            }
        });
    }

}
