export class ResponseUser {
    header: Header;
    body: Body;
}
export class Header {
    requestId: string;
    requestReceivedTime: string;
    responseCode: string;
    responseMessage: string;
    responseProcessingTimeInMs: number;
    responseTime: string;
    traceId: string;
    hopCount: number = 0;
}
export class Body {
    accessToken: string;
    applicationAuthenticatedAt: string;
    applicationName: string;
    clientAuthenticatedAt: string;
    clientId: string;
    roleId: string;
    status: string;
    tokenValidTill: string;
    userAuthenticatedAt: string;
    userId: string;
}