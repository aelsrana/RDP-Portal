import { RequestUtil } from './../model/request/request.util';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { PATH } from './../constant/path';
import { Injectable } from '@angular/core';
import { RequestSingle } from '../model/request/request.single';
import { RestClient } from 'src/app/shared/services/rest.client';
import { AuthService } from 'src/app/shared/guard';
import { GET_EXHOUSE_LIST_URL, BRANCH_LIST_URL, ENVICO_URL } from 'src/app/shared/constant/api';
import { Observable } from 'rxjs';
import { ACTIVE, BANK_ID, RDP_URL } from 'src/app/shared';

@Injectable()
export class UtilService {
    
    public statusList : any[];
    constructor(private restClient: RestClient, private authService: AuthService) {
     
    }

    public getBranchList() {
        let requestBranch = new RequestUtil();
        requestBranch.header.requestType = BRANCH_LIST_URL;
        requestBranch.header.requestSourceService = "get-list-by-bank";
        requestBranch.body.status = ACTIVE;
        requestBranch.body.bankOid = BANK_ID;
        return this.restClient.post(
            ENVICO_URL + BRANCH_LIST_URL, requestBranch
        )}

    public getExHouseList() {
        let requestParams = new RequestUtil();
        requestParams.header.requestType = GET_EXHOUSE_LIST_URL;
        requestParams.header.requestSourceService = "get-exchange-house-list";
        requestParams.body.status = "Active";
        return this.restClient.post(
            RDP_URL + GET_EXHOUSE_LIST_URL, requestParams
    )}


    copyTextToClipboard(text) {
        var input = document.createElement("input");
        input.style.position = 'fixed';
        input.style.top = '0';
        input.style.left = '0';
        input.style.opacity = '0';
        input.value = text;
        document.body.appendChild(input);
        input.select();
        try {
            var successful = document.execCommand('copy');
            if(successful){
                return true;
            }
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        document.body.removeChild(input);
        return false;
    } 
}
