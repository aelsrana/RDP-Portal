import { RestClient } from "src/app/shared/services/rest.client";
import { Injectable } from "@angular/core";
import { SearchParams } from "src/app/shared/model/request/search-param";
import { Observable } from "rxjs";
import { RDP_URL, GET_REMI_MY_APPROVE_LIST_URL, UNLOCK_FROM_MY_APPROVE_URL, GET_DETAIL_FOR_APPROVE_URL, APPROVE_URL, APPROVER_REJECT_URL} from "src/app/shared";
import { RequestList } from "src/app/shared/model/request/request-list";
import { RequestCommonModel } from '../../shared/model/request/request-common';
import { RequestSingle } from "src/app/shared/model/request/request.single";
import { RequestLock } from "src/app/shared/model/request/request.lock";
import { AuthService } from '../../shared/guard/index';


@Injectable()
export class RemittanceMyApproveService {
    private userInfo: any;

    constructor(private restClient: RestClient, private authService: AuthService) {
        this.userInfo = this.authService.getAuthInfo();
    }

    getList(params: SearchParams, loginId:string): Observable<any> {
        return this.restClient.post(RDP_URL + GET_REMI_MY_APPROVE_LIST_URL, paramsToGetList(params, loginId))
    }

    unlockFromMyApprovalRemittance(oids:any[], loginId:string ): Observable<any> {
        return this.restClient.post(RDP_URL + UNLOCK_FROM_MY_APPROVE_URL, paramsToUnlockFromMyApprovalRemittance(oids, loginId))
    }

    public getDetailForApprove(oid: string): Observable<any> {
        let requestParams = new RequestCommonModel();
        requestParams.header.requestType = GET_DETAIL_FOR_APPROVE_URL;
        requestParams.header.requestSourceService = "terminal";
        requestParams.body.oid = oid;
        return this.restClient.post(RDP_URL + GET_DETAIL_FOR_APPROVE_URL, requestParams);
    }

    public approveRequest(oid: string): Observable<any> {
        let requestParams = new RequestCommonModel();
        requestParams.header.requestType = APPROVE_URL;
        requestParams.header.requestSourceService = "terminal";
        requestParams.body.oid = oid;
        requestParams.body.loginId = this.userInfo.loginId;
        return this.restClient.post(RDP_URL + APPROVE_URL, requestParams);
    }
    public requestReject(remittanceOid: string, rejectionCause: string) {
        let requestModel = new RequestCommonModel();
        requestModel.header.requestType = APPROVER_REJECT_URL;
        requestModel.header.requestSourceService = "approver-reject";
        requestModel.body.loginId = this.userInfo.loginId;
        requestModel.body.oid = remittanceOid;
        requestModel.body.rejectionCause = rejectionCause;
        return this.restClient.post(RDP_URL + APPROVER_REJECT_URL, requestModel);
    }

}

function paramsToGetList(params: SearchParams, loginId :string) {
    let requestParams = new RequestList();
    requestParams.header.requestType = GET_REMI_MY_APPROVE_LIST_URL;
    requestParams.header.requestSourceService = "get-my-edit-list";
    requestParams.body.searchParams = params;
    requestParams.body.loginId= loginId;
    return requestParams;
}

function paramsToUnlockFromMyApprovalRemittance(oids: any[], loginId: string){
    let requestParams = new RequestLock();
    requestParams.header.requestType = UNLOCK_FROM_MY_APPROVE_URL;
    requestParams.header.requestSourceService = "unlock-from-my-approval-list";
    requestParams.body.oids = oids;
    requestParams.body.loginId = loginId;
    return requestParams;
}
