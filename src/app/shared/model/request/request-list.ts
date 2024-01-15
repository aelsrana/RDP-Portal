import { UUID } from 'angular2-uuid';
import { SearchParams } from './search-param';
import { CLIENT_NAME, APPLICATION_NAME, REQUEST_VERSION, REQUEST_TIMEOUT_IN_SECONDS } from '../../index';

export class RequestList {
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
    operation: string;
    roleId: string;
    loginId: string;
    searchParams = new SearchParams();

}