import { LoaderService } from 'src/app/shared/services/loader.service';
import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { SearchRecipientService } from './search-recipient.service';
import { IFR_IMAGE_PATH, JPG_EXTENTION } from '../../shared/constant/constant';
import { Element } from '@angular/compiler';
import { Message } from 'primeng/api';

declare var $: any;

@Component({
    selector: "app-search-recipient",
    templateUrl: "./search-recipient.component.html",
    styleUrls: ["./search-recipient.component.css"]
})
export class SearchRecipientComponent implements OnInit {
    private sub: any;
    public isError: boolean = false;

    public recipientMobile: string = '';
    public recipientNid: string = '';
    public recipientPassport: string = '';
    public recipientDrivingLic: string = '';
    public qrCodeScanDisplay: boolean = false;

    public personList: any[] = null;

    public mobileValidSign: boolean = false;
    public nidValidSign: boolean = false;
    public passportValidSign: boolean = false;

    @ViewChild('scanner') scanner: ZXingScannerComponent;
    public hasCamera: boolean = false;
    public hasPermission; isShowing: boolean;
    public selectedDevice: any;

    @Output() onBeneficiarySelect = new EventEmitter();
    @Output() onBeneficiaryAdd = new EventEmitter();

    public showAdvancedSearchOptions: boolean = false;

    @ViewChild('searchButtonRef') searchButtonRef: ElementRef;

    /*------------ Message -------------*/
    public growlMessage: Message[] = [];

    @HostListener('document:keyup.enter', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.searchButtonRef.nativeElement.disabled) {
            this.searchOnClick();
        }
    }

    constructor(public searchRecipientService: SearchRecipientService, private router: Router, private route: ActivatedRoute, private cd: ChangeDetectorRef,
        private loaderService: LoaderService) {

    }

    ngOnInit(): void {
        this.scanner.camerasFound.subscribe((devices: any[]) => {
            for (const device of devices) {
                if (device.kind.toString() === 'videoinput') {
                    this.hasCamera = true;
                    this.selectedDevice = device;
                }
            }
        });
        // this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
        // });
        this.scanner.permissionResponse.subscribe((answer: boolean) => {
            this.hasPermission = answer;
        });
        $("#recipientMobile").focus();
    }

    handleQrCodeResult(resultString: string) {
        //resultString
        this.qrCodeScanDisplay = false;
        this.loaderService.display(true);
        this.searchRecipientService.searchByQR(resultString)
            .subscribe(resData => {
                this.loaderService.display(false);
                if (resData != null && resData.header.responseCode == '200') {
                    if (resData.body.personDetails && resData.body.personDetails.mobileNoList && resData.body.personDetails.mobileNoList.length > 0) {
                        this.recipientMobile = resData.body.personDetails.mobileNoList[0].mobileNo;
                    }
                    this.onBeneficiarySelect.emit(resData.body);
                    this.setInitialState();
                }
                else {
                    this.growlMessage = [];
                    this.growlMessage.push({ severity: 'error', summary: 'Error Message', detail: resData.header.responseMessage });
                }
            },
            err => {
                this.loaderService.display(false);
                this.isShowing = false;
                this.isError = true;
                console.log(err);
            });
    }

    searchOnClick() {
        this.personList = [];
        this.loaderService.display(true);
        this.isShowing = true;
        this.isError = false;
        if ((this.recipientNid !== "" && this.recipientNid) || (this.recipientPassport !== "" && this.recipientPassport) || this.recipientDrivingLic !== "") {
            this.searchBeneficiaryByNID();
        }
        else {
            this.searchBeneficiaryByMobileNo();
        }
    }

    searchBeneficiaryByMobileNo() {
        if (this.recipientMobile !== '' && this.mobileValidSign) {
            this.searchRecipientService.searchRecipient("MobileNo", this.recipientMobile)
                .subscribe(resData => {
                    this.loaderService.display(false);
                    this.isShowing = false;
                    if (resData != null && resData.header.responseCode == '200') {
                        this.personList = resData.body.personList;
                    }
                    else {
                        this.personList = [];
                    }

                    if (this.personList.length === 0) {
                        this.showAdvancedSearchOptions = true;
                    }
                },
                err => {
                    this.loaderService.display(false);
                    this.isShowing = false;
                    this.isError = true;
                    console.log(err);
                });
        }
    }

    getImagePath(photoPath): string {
        return IFR_IMAGE_PATH + photoPath.slice(photoPath.lastIndexOf("/") + 1, photoPath.lastIndexOf(".")) + JPG_EXTENTION;
    }

    setInitialState() {
        this.recipientMobile = "";
        //this.recipientNid = "";
        //this.recipientPassport = "";
        //this.recipientDrivingLic = "";
        this.mobileValidSign = false;
        //this.nidValidSign = false;
        //this.passportValidSign = false;
        this.personList = null;
        this.showAdvancedSearchOptions = false;
    }

    selectedBeneficiary(photoIdType, photoIdNo) {
        this.loaderService.display(true);
        this.isShowing = true;
        this.searchRecipientService.searchRecipient(photoIdType, photoIdNo)
            .subscribe(resData => {
                this.loaderService.display(false);
                this.isShowing = false;
                if (resData != null && resData.header.responseCode == '200' && resData.body.isNewPerson == "No") {
                    this.onBeneficiarySelect.emit(resData.body);
                    this.setInitialState();
                }
                else {

                }
            },
            err => {
                this.loaderService.display(false);
                this.isShowing = false;
                this.isError = true;
                console.log(err);
            });
    }

    onNoneOfAboveClick() {
        this.personList = [];
        this.showAdvancedSearchOptions = true;
    }

    searchBeneficiaryByNID() {
        if (this.recipientNid !== '' && this.nidValidSign) {
            if (this.recipientNid.length === 10) {
                this.searchRecipientService.searchRecipient('SmartNID', this.recipientNid)
                    .subscribe(resData => {
                        if (resData != null && resData.header.responseCode == '200') {
                            this.loaderService.display(false);
                            this.isShowing = false;
                            this.onBeneficiarySelect.emit(resData.body);
                            this.setInitialState();
                        }
                        else {
                            this.searchBeneficiaryByPassport();
                        }
                    },
                    err => {
                        this.loaderService.display(false);
                        this.isShowing = false;
                        this.isError = true;
                        console.log(err);
                    });
            }
            else {
                this.searchRecipientService.searchRecipient('NID', this.recipientNid)
                    .subscribe(resData => {
                        if (resData != null && resData.header.responseCode == '200') {
                            this.loaderService.display(false);
                            this.isShowing = false;
                            this.onBeneficiarySelect.emit(resData.body);
                            this.setInitialState();
                        }
                        else {
                            this.searchBeneficiaryByPassport();
                        }
                    },
                    err => {
                        this.loaderService.display(false);
                        this.isShowing = false;
                        this.isError = true;
                        console.log(err);
                    });
            }
        }
        else {
            this.searchBeneficiaryByPassport();
        }
    }

    searchBeneficiaryByPassport() {
        if (this.recipientPassport !== '' && this.passportValidSign) {
            this.searchRecipientService.searchRecipient('PassportNo', this.recipientPassport)
                .subscribe(resData => {
                    if (resData != null && resData.header.responseCode == '200') {
                        this.loaderService.display(false);
                        this.isShowing = false;
                        this.onBeneficiarySelect.emit(resData.body);
                        this.setInitialState();
                    }
                    else {
                        this.searchBeneficiaryByDrivingLic();
                    }
                },
                err => {
                    this.loaderService.display(false);
                    this.isShowing = false;
                    this.isError = true;
                    console.log(err);
                });
        }
        else {
            this.searchBeneficiaryByDrivingLic();
        }
    }

    searchBeneficiaryByDrivingLic() {
        if (this.recipientDrivingLic !== "") {
            this.searchRecipientService.searchRecipient('DrivingLicense', this.recipientDrivingLic)
                .subscribe(resData => {
                    if (resData != null && resData.header.responseCode == '200') {
                        this.loaderService.display(false);
                        this.isShowing = false;
                        this.onBeneficiarySelect.emit(resData.body);
                        this.setInitialState();
                    }
                    else {
                        this.loaderService.display(false);
                        this.isShowing = false;
                        // Add as a new person
                        this.onBeneficiaryAdd.emit(this.recipientMobile);
                        this.setInitialState();
                    }
                },
                err => {
                    this.loaderService.display(false);
                    this.isShowing = false;
                    this.isError = true;
                    console.log(err);
                });
        }
        else {
            this.loaderService.display(false);
            this.isShowing = false;
            // Add as a new person
            this.onBeneficiaryAdd.emit(this.recipientMobile);
            this.setInitialState();
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

    checkValidNidNo(inputNid) {
        if (inputNid.length == 13 || inputNid.length == 17 || inputNid.length == 10) {
            this.nidValidSign = true;
        }
        else {
            this.nidValidSign = false;
        }
    }

    checkValidPassportNo(inputPassport) {
        var reg = new RegExp("[a-zA-Z]{1,2}[0-9]{7}");
        if (reg.test(inputPassport)) {
            this.passportValidSign = true;
        }
        else {
            this.passportValidSign = false;
        }
    }

    showQRCodeScanDialog() {
        this.qrCodeScanDisplay = true;
    }
}