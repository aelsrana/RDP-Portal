import { Injectable } from "@angular/core";
import { RouterStateSnapshot } from "@angular/router";

@Injectable()
export class StatusService {

    constructor() { }

    getStatus(roleId:string, url: string): any[]{
        if(url =='/dashboard/remittance-list'){
            return [
                { key: 'ApplicationReceived',  value: 'Application Received'},
                { key: 'ApplicationReviewed',  value: 'Application Reviewed'},
                { key: 'ExchangeWindowOpned',  value: 'Exchange Window Opned'},
                { key: 'ApplicationSubmitted', value: 'Application Submitted'},
                { key: 'ApplicationRejected',  value: 'ApplicationRejected' },
                { key: 'ApplicationRejectedByApprover', value: 'Application Rejected by Approver'},
                { key: 'BankApproved',         value: 'Bank Approved' }, 
                { key: 'DataUpdated',          value: 'Data Updated' },
                { key: 'Disbursed',            value: 'Disbursed' }
        
              ];
        }
        else if(url =='/dashboard/edit-remittance-request' || url =='/dashboard/my-edit-remittance-request'){
            return [
                { key: 'ApplicationReceived',  value: 'Application Received'},
                { key: 'ApplicationReviewed',  value: 'Application Reviewed'},
                { key: 'ExchangeWindowOpned',  value: 'Exchange Window Opned'},
                { key: 'ApplicationSubmitted', value: 'Application Submitted'},
                { key: 'BankApproved',         value: 'Bank Approved' }, 
                { key: 'DataUpdated',          value: 'Data Updated' }
        
              ];
        }
        else if(url =='/dashboard/approve-remittance-request' || url =='/dashboard/my-approve-remittance-request'){
            return [
                { key: 'ApplicationSubmitted',         value: 'Application Submitted' },
                { key: 'DataUpdated',                  value: 'Data Updated' }        
              ];
        }
        
        return [];
    }

}