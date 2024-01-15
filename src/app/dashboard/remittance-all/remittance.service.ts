import { RestClient } from "src/app/shared/services/rest.client";
import { Injectable } from "@angular/core";
import { SearchParams } from "src/app/shared/model/request/search-param";
import { Observable } from "rxjs";
import { GET_REMI_LIST_URL, RDP_URL, GET_BY_OID_URL } from "src/app/shared";
import { RequestList } from "src/app/shared/model/request/request-list";
import { RequestSingle } from "src/app/shared/model/request/request.single";



@Injectable()
export class RemittanceService {

    constructor(private restClient: RestClient) {

    }

    getList(params: SearchParams): Observable<any> {
        return this.restClient.post(RDP_URL + GET_REMI_LIST_URL, paramsToGetList(params))
    }

    getByOid(oid: string): Observable<any> {
        return this.restClient.post(RDP_URL + GET_BY_OID_URL, paramsToGetByOid(oid))
    }

}

function paramsToGetList(params: SearchParams) {
    let requestParams = new RequestList();
    requestParams.header.requestType = GET_REMI_LIST_URL;
    requestParams.header.requestSourceService = "get-list";
    requestParams.body.searchParams = params;
    return requestParams;
}

function paramsToGetByOid(oid :string) {
    let requestParams = new RequestSingle();
    requestParams.header.requestType = GET_BY_OID_URL;
    requestParams.header.requestSourceService = "get-by-oid";
    requestParams.body.oid = oid;
    return requestParams;
}