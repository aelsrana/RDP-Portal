import { UUID } from 'angular2-uuid';
import { CLIENT_NAME, APPLICATION_NAME, REQUEST_VERSION, REQUEST_TIMEOUT_IN_SECONDS } from '../../index';

export class RequestLock {
    header : Header = new Header();
    meta : Object = new Object();
    body : Body = new Body();
}
export class Header {
    requestId: string = UUID.UUID();
    requestClient: string = CLIENT_NAME;
    requestType: string;
    requestSource: string = APPLICATION_NAME;
    requestSourceService: string;
    requestVersion: string = REQUEST_VERSION;
    requestTime: Date = new Date();
    requestTimeoutInSeconds: number = REQUEST_TIMEOUT_IN_SECONDS;
    requestRetryCount: number = 0;
}

class Body {
    oids:any[];
    loginId:string;
}