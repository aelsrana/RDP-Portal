import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { AppStorageService } from "../../shared/services/index";
import { Observable } from "rxjs";
import { RestClient } from "../../shared/services/rest.client";
import { ENVICO_URL, GET_DIVISION_URL, GET_DISTRICT_URL, GET_THANA_URL, GET_UNION_URL, GET_EXHOUSE_LIST_URL, RDP_URL, SEND_OTP_URL, SAVE_EDIT_DETAIL_URL, GET_DETAIL_FOR_EDIT_URL } from "../../shared/constant/api";
import { RequestGeoCode } from '../../shared/model/request/request-geo-code';
import { RequestExchangeHouse } from '../../shared/model/request/request-exchange-house';
import { RequestCommonModel } from '../../shared/model/request/request-common';
import { RequestSaveDetailModel } from '../../shared/model/request/request-save-detail';
import { IRemittanceInformation, IRecipientDetails, ISenderDetails, IRemittanceEditInformation } from'../bsr-information/bsr-information.interface';
import { AuthService } from '../../shared/guard/index';

@Injectable()
export class RemittanceMyEditDetailService {
    private userInfo: any;
    constructor(private appStorageService: AppStorageService, private restClient: RestClient, private authService: AuthService) {
        this.userInfo = this.authService.getAuthInfo();
    }

    public getDivisionList(): Observable<any> {
        let requestGeoCode = new RequestGeoCode();
        requestGeoCode.header.requestType = 'geodata/dropdown/v1/get-division-list';
        requestGeoCode.header.requestSourceService = "terminal";
        requestGeoCode.body.operation = 'getDivisionList';
        return this.restClient.post(ENVICO_URL + GET_DIVISION_URL, requestGeoCode);
    }
    public getDistrictList(divisionCode: string): Observable<any> {
        let requestGeoCode = new RequestGeoCode();
        requestGeoCode.header.requestType = GET_DISTRICT_URL;
        requestGeoCode.header.requestSourceService = "get-district-by-division-id";
        requestGeoCode.body.divisionCode = divisionCode;
        return this.restClient.post(ENVICO_URL + GET_DISTRICT_URL, requestGeoCode);
    }
    public getThanaList(districtCode: string): Observable<any> {
        let requestGeoCode = new RequestGeoCode();
        requestGeoCode.header.requestType = GET_THANA_URL;
        requestGeoCode.header.requestSourceService = "terminal";
        requestGeoCode.body.districtCode = districtCode;
        
        return this.restClient.post(ENVICO_URL + GET_THANA_URL, requestGeoCode);
    }
    public getUnionList(districtCode: string, upazillaCode: string): Observable<any> {
        let requestGeoCode = new RequestGeoCode();
        requestGeoCode.header.requestType = GET_UNION_URL;
        requestGeoCode.header.requestSourceService = "terminal";
        requestGeoCode.body.districtCode = districtCode;
        requestGeoCode.body.upazillaCode = upazillaCode;
        return this.restClient.post(ENVICO_URL + GET_UNION_URL, requestGeoCode);
    }
    public getExchangeHouseList(): Observable<any> {
        let requestExchangeHouse = new RequestExchangeHouse();
        requestExchangeHouse.header.requestType = GET_EXHOUSE_LIST_URL;
        requestExchangeHouse.header.requestSourceService = "get-exchange-house-list";
        requestExchangeHouse.body.status = "Active";
        return this.restClient.post(RDP_URL + GET_EXHOUSE_LIST_URL, requestExchangeHouse);
    }

    public sendOTP(mobileNo: string): Observable<any> {
        let requestCommonModel = new RequestCommonModel();
        requestCommonModel.header.requestType = SEND_OTP_URL;
        requestCommonModel.header.requestSourceService = "send-otp";
        requestCommonModel.body.mobileNo = mobileNo;
        return this.restClient.post(RDP_URL + SEND_OTP_URL, requestCommonModel);
    }

    public saveEditDetail(isRecipientDetailUpdate: string, isSenderDetailUpdate:
        string, remittanceInformation: IRemittanceEditInformation, recipientDetails: IRecipientDetails, senderDetails: ISenderDetails): Observable<any> {
        let requestSaveDetailModel = new RequestSaveDetailModel();
        requestSaveDetailModel.header.requestType = SAVE_EDIT_DETAIL_URL;
        requestSaveDetailModel.header.requestSourceService = "save-edit-detail";
        requestSaveDetailModel.body.isRecipientDetailUpdate = isRecipientDetailUpdate;
        requestSaveDetailModel.body.isSenderDetailUpdate = isSenderDetailUpdate;
        requestSaveDetailModel.body.remittanceInformation = remittanceInformation;
        requestSaveDetailModel.body.recipientDetails = recipientDetails;
        requestSaveDetailModel.body.senderDetails = senderDetails;
        requestSaveDetailModel.body.userName = this.userInfo.userName;
        requestSaveDetailModel.body.branchOid =  this.userInfo.branchOid;
        requestSaveDetailModel.body.roleId = this.userInfo.loginId;
        requestSaveDetailModel.body.loginId = this.userInfo.loginId;
        return this.restClient.post(RDP_URL + SAVE_EDIT_DETAIL_URL, requestSaveDetailModel);
    }

    public getDetailForEdit(oid: string): Observable<any> {
        let requestCommonModel = new RequestCommonModel();
        requestCommonModel.header.requestType = GET_DETAIL_FOR_EDIT_URL;
        requestCommonModel.header.requestSourceService = "terminal";
        requestCommonModel.body.oid = oid;
        return this.restClient.post(RDP_URL + GET_DETAIL_FOR_EDIT_URL, requestCommonModel);
    }
}