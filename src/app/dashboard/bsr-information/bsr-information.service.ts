import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { AppStorageService } from "../../shared/services/index";
import { Observable } from "rxjs";
import { RestClient } from "../../shared/services/rest.client";
import {
    ENVICO_URL, GET_DIVISION_URL, GET_DISTRICT_URL, GET_THANA_URL, GET_UNION_URL, GET_EXHOUSE_LIST_URL, RDP_URL, SEND_OTP_URL,
    SAVE_DETAIL_URL, SAVE_NEW_URL, PRINT_ACK_URL, MATCH_ACK_URL, REQUEST_CANCEL_URL, META_PROPERTY_URL
} from "../../shared/constant/api";
import { RequestGeoCode } from '../../shared/model/request/request-geo-code';
import { RequestExchangeHouse } from '../../shared/model/request/request-exchange-house';
import { RequestCommonModel } from '../../shared/model/request/request-common';
import { RequestSaveDetailModel } from '../../shared/model/request/request-save-detail';
import { IRemittanceInformation, IRecipientDetails, ISenderDetails } from './bsr-information.interface';
import { AuthService } from '../../shared/guard/index';
import { RequestUtil } from 'src/app/shared/model/request/request.util';

@Injectable()
export class BsrInformationService {
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

    public saveDetail(isNewPerson: string, isRecipientDetailUpdate: string, isNewSender: string, isSenderDetailUpdate:
        string, remittanceInformation: IRemittanceInformation, recipientDetails: IRecipientDetails, senderDetails: ISenderDetails): Observable<any> {
        let requestSaveDetailModel = new RequestSaveDetailModel();
        requestSaveDetailModel.header.requestType = SAVE_DETAIL_URL;
        requestSaveDetailModel.header.requestSourceService = "save-detail";
        requestSaveDetailModel.body.isNewPerson = isNewPerson;
        requestSaveDetailModel.body.isRecipientDetailUpdate = isRecipientDetailUpdate;
        requestSaveDetailModel.body.isNewSender = isNewSender;
        requestSaveDetailModel.body.isSenderDetailUpdate = isSenderDetailUpdate;
        requestSaveDetailModel.body.remittanceInformation = remittanceInformation;
        requestSaveDetailModel.body.recipientDetails = recipientDetails;
        requestSaveDetailModel.body.senderDetails = senderDetails;
        requestSaveDetailModel.body.userName = this.userInfo.userName;
        requestSaveDetailModel.body.branchOid = this.userInfo.branchOid;
        requestSaveDetailModel.body.roleId = this.userInfo.loginId;
        requestSaveDetailModel.body.loginId = this.userInfo.loginId;
        return this.restClient.post(RDP_URL + SAVE_DETAIL_URL, requestSaveDetailModel);
    }
    public printAck(remittanceOid: string) {
        let requestModel = new RequestCommonModel();
        requestModel.header.requestType = PRINT_ACK_URL;
        requestModel.header.requestSourceService = "request-print-ack";
        requestModel.body.loginId = this.userInfo.loginId;
        requestModel.body.oid = remittanceOid;
        return this.restClient.post(RDP_URL + PRINT_ACK_URL, requestModel);
    }
    public matchAck(remittanceOid: string) {
        let requestModel = new RequestCommonModel();
        requestModel.header.requestType = MATCH_ACK_URL;
        requestModel.header.requestSourceService = "request-match-ack";
        requestModel.body.loginId = this.userInfo.loginId;
        requestModel.body.oid = remittanceOid;
        return this.restClient.post(RDP_URL + MATCH_ACK_URL, requestModel);
    }
    public requestSubmit(remittanceOid: string, actualAmountInBdt: string) {
        let requestModel = new RequestCommonModel();
        requestModel.header.requestType = SAVE_NEW_URL;
        requestModel.header.requestSourceService = "save-new";
        requestModel.body.loginId = this.userInfo.loginId;
        requestModel.body.remittanceOid = remittanceOid;
        requestModel.body.actualAmountInBdt = actualAmountInBdt;
        return this.restClient.post(RDP_URL + SAVE_NEW_URL, requestModel);
    }
    public requestReject(remittanceOid: string, rejectionCause: string) {
        let requestModel = new RequestCommonModel();
        requestModel.header.requestType = REQUEST_CANCEL_URL;
        requestModel.header.requestSourceService = "request-cancel";
        requestModel.body.loginId = this.userInfo.loginId;
        requestModel.body.oid = remittanceOid;
        requestModel.body.rejectionCause = rejectionCause;
        return this.restClient.post(RDP_URL + REQUEST_CANCEL_URL, requestModel);
    }

    public getMetaProperty() {
        let requestParams = new RequestUtil();
        requestParams.header.requestType = META_PROPERTY_URL;
        requestParams.header.requestSourceService = "get-metaproperty-by-oid";
        requestParams.body.oids = ['101'];
        return this.restClient.post(
            ENVICO_URL + META_PROPERTY_URL, requestParams
        );
    }

}