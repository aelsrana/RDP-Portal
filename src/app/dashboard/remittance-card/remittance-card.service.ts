import { GET_REMIT_CARD_URL } from './../../shared/constant/api';
import { RestClient } from "src/app/shared/services/rest.client";
import { Injectable } from "@angular/core";
import { SearchParams } from "src/app/shared/model/request/search-param";
import { Observable } from "rxjs";
import { GET_REMI_LIST_URL, RDP_URL, GET_PERSON_BY_OID_URL, SEND_EMAIL_URL } from "src/app/shared";
import { RequestList } from "src/app/shared/model/request/request-list";
import { RequestSingle } from "src/app/shared/model/request/request.single";
import { RequestSendEmail } from 'src/app/shared/model/request/request-send-email';
import { SendEmail } from 'src/app/shared/model/model/send-email';



@Injectable()
export class RemittanceCardService {

    constructor(private restClient: RestClient) {

    }

    getList(params: SearchParams): Observable<any> {
        return this.restClient.post(RDP_URL + GET_REMIT_CARD_URL, paramsToGetList(params))
    }

    getByOid(oid: string): Observable<any> {
        return this.restClient.post(RDP_URL + GET_PERSON_BY_OID_URL, paramsToGetByOid(oid))
    }

    sendEmail(sendEmail: SendEmail): Observable<any> {
        return this.restClient.post(RDP_URL + SEND_EMAIL_URL, paramsToSendEmail(sendEmail))
    }

}

function paramsToGetList(params: SearchParams) {
    let requestParams = new RequestList();
    requestParams.header.requestType = GET_REMIT_CARD_URL;
    requestParams.header.requestSourceService = "get-person-list-for-remit-card";
    requestParams.body.searchParams = params;
    return requestParams;
}

function paramsToGetByOid(oid :string) {
    let requestParams = new RequestSingle();
    requestParams.header.requestType = GET_PERSON_BY_OID_URL;
    requestParams.header.requestSourceService = "get-by-oid";
    requestParams.body.oid = oid;
    return requestParams;
}

function paramsToSendEmail(sendEmail: SendEmail) {
    let requestParams = new RequestSendEmail();
    requestParams.header.requestType = SEND_EMAIL_URL;
    requestParams.header.requestSourceService = "send-email";
    requestParams.body.emailBody = "Please find the attachment for your Remit Card";
    requestParams.body.emailSubject = "Remit Card";
    requestParams.body.emailTo = sendEmail.emailTo;;
    requestParams.body.emailCc = sendEmail.emailCc;
    requestParams.body.emailBcc = sendEmail.emailBcc;
    requestParams.body.fileName =sendEmail.fileName;
    return requestParams;
}