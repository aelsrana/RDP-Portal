import { RestClient } from "src/app/shared/services/rest.client";
import { Injectable } from "@angular/core";
import { SearchParams } from "src/app/shared/model/request/search-param";
import { Observable } from "rxjs";
import { RDP_URL, GET_REMI_EDIT_LIST_URL, LOCK_FOR_EDIT_URL } from "src/app/shared";
import { RequestList } from "src/app/shared/model/request/request-list";
import { RequestSingle } from "src/app/shared/model/request/request.single";
import { RequestLock } from "src/app/shared/model/request/request.lock";



@Injectable()
export class RemittanceEditService {

    constructor(private restClient: RestClient) {

    }

    getList(params: SearchParams): Observable<any> {
        return this.restClient.post(RDP_URL + GET_REMI_EDIT_LIST_URL, paramsToGetList(params))
    }

    lockForEditRemittance(oids:any[], loginId:string ): Observable<any> {
        return this.restClient.post(RDP_URL + LOCK_FOR_EDIT_URL, paramsToLockForEditRemittance(oids, loginId))
    }

}

function paramsToGetList(params: SearchParams) {
    let requestParams = new RequestList();
    requestParams.header.requestType = GET_REMI_EDIT_LIST_URL;
    requestParams.header.requestSourceService = "get-edit-list";
    requestParams.body.searchParams = params;
    return requestParams;
}

function paramsToLockForEditRemittance(oids: any[], loginId: string){
    let requestParams = new RequestLock();
    requestParams.header.requestType = LOCK_FOR_EDIT_URL;
    requestParams.header.requestSourceService = "lock-for-edit";
    requestParams.body.oids = oids;
    requestParams.body.loginId = loginId;
    return requestParams;
}