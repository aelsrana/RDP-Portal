import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { AppStorageService } from "../../shared/services/index";
import { Observable } from "rxjs";
import { RestClient } from "../../shared/services/rest.client";
import { SEARCH_RECIP_URL, RDP_URL, QR_SEARCH_URL } from "../../shared/constant/api";
import { RequestSearch } from '../../shared/model/request/request-search';
import { AuthService } from '../../shared/guard/index';
import { RequestCommonModel } from '../../shared/model/request/request-common';

@Injectable()
export class SearchRecipientService {
    private userInfo: any;
    constructor(private appStorageService: AppStorageService, private restClient: RestClient, private authService: AuthService) {
        this.userInfo = this.authService.getAuthInfo();
    }

    public searchRecipient(searchType: string, searchIdNo: string): Observable<any> {
        let requestSearch = new RequestSearch();
        requestSearch.header.requestType = SEARCH_RECIP_URL;
        requestSearch.header.requestSourceService = "search-recipient";
        requestSearch.body.searchType = searchType;
        requestSearch.body.searchIdNo = searchIdNo;
        requestSearch.body.roleId = this.userInfo.roleId;
        requestSearch.body.branchOid = this.userInfo.branchOid;
        requestSearch.body.loginId = this.userInfo.loginId;
        return this.restClient.post(RDP_URL + SEARCH_RECIP_URL, requestSearch);
    }
    public searchByQR(qrCode: string): Observable<any> {
        let requestModel = new RequestCommonModel();
        requestModel.header.requestType = QR_SEARCH_URL;
        requestModel.header.requestSourceService = "qr-search";
        requestModel.body.qrCode = qrCode;
        return this.restClient.post(RDP_URL + QR_SEARCH_URL, requestModel);
    }
}