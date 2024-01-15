import { RestClient } from "src/app/shared/services/rest.client";
import { Injectable } from "@angular/core";
import { SearchParams } from "src/app/shared/model/request/search-param";
import { Observable } from "rxjs";
import { RDP_URL, GET_REMI_MY_EDIT_LIST_URL, UNLOCK_FROM_MY_EDIT_URL } from "src/app/shared";
import { RequestList } from "src/app/shared/model/request/request-list";
import { RequestSingle } from "src/app/shared/model/request/request.single";
import { RequestLock } from "src/app/shared/model/request/request.lock";


@Injectable()
export class RemittanceMyEditService {

    constructor(private restClient: RestClient) {

    }

    getList(params: SearchParams, loginId:string): Observable<any> {
        return this.restClient.post(RDP_URL + GET_REMI_MY_EDIT_LIST_URL, paramsToGetList(params, loginId))
    }

    unlockFromMyEditRemittance(oids:any[], loginId:string ): Observable<any> {
        return this.restClient.post(RDP_URL + UNLOCK_FROM_MY_EDIT_URL, paramsToUnlockFromMyEditRemittance(oids, loginId))
    }

}

function paramsToGetList(params: SearchParams, loginId :string) {
    let requestParams = new RequestList();
    requestParams.header.requestType = GET_REMI_MY_EDIT_LIST_URL;
    requestParams.header.requestSourceService = "get-my-edit-list";
    requestParams.body.searchParams = params;
    requestParams.body.loginId= loginId;
    return requestParams;
}

function paramsToUnlockFromMyEditRemittance(oids: any[], loginId: string){
    let requestParams = new RequestLock();
    requestParams.header.requestType = UNLOCK_FROM_MY_EDIT_URL;
    requestParams.header.requestSourceService = "unlock-from-my-edit-list";
    requestParams.body.oids = oids;
    requestParams.body.loginId = loginId;
    return requestParams;
}