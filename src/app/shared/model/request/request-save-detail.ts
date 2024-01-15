import { UUID } from 'angular2-uuid';
import { CLIENT_NAME, APPLICATION_NAME, REQUEST_VERSION, REQUEST_TIMEOUT_IN_SECONDS } from '../../index';
import { IRemittanceInformation, IRecipientDetails, ISenderDetails} from'../../../dashboard/bsr-information/bsr-information.interface';

export class RequestSaveDetailModel {
    header : Header = new Header();
    meta : Object = new Object();
    body : Body = new Body();
}
export class Header {
    requestId: string = UUID.UUID();
    requestClient: string = CLIENT_NAME;
    requestType: string;
    requestSource: string = "payscope";
    requestSourceService: string;
    requestVersion: string = REQUEST_VERSION;
    requestTime: Date = new Date();
    requestTimeoutInSeconds: number = REQUEST_TIMEOUT_IN_SECONDS;
    requestRetryCount: number = 0;
}
class Body {
    isNewPerson: string;
    isRecipientDetailUpdate: string;
    isNewSender: string;
    isSenderDetailUpdate: string;
    remittanceInformation: IRemittanceInformation;
    recipientDetails: IRecipientDetails;
    senderDetails: ISenderDetails;
    userName: string;
    branchOid: string;
    roleId: string;
    loginId: string;
}