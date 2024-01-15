export interface ISocialMediaJson {
    facebook: string;
    email: string;
    imo: string;
    internetUser: string;
    smartphoneUser: string;
    viber: string;
    whatsapp: string;
}

export interface IAddress {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    postalCode: string;
    divisionName: string;
    divisionGeocode: string;
    districtName: string;
    districtGeocode: string;
    upazillaName: string;
    upazillaGeocode: string;
    unionName: string;
    unionGeocode: string;
    country: string;
}
export interface IRemittanceInformation {
    oid: string;
    photoId: string;
    nidVerification: string;
    photoIdType: string;
    recipientMobileNo: string;
    recipientName: string;
    recipientGender: string;
    recipientDOB: string;
    pin: string;
    ttNumber: string;
    amount: string;
    senderCountry: string;
    senderName: string;
    exHouseOid: string;
    exHouseName: string;
}

export interface IRemittanceEditInformation {
    oid: string;
    photoId: string;
    photoIdType: string;
    nidVerification: string;
    recipientMobileNo: string;
    recipientName: string;
    recipientGender: string;
    recipientDOB: string;
    pin: string;
    ttNumber: string;
    amount: string;
    senderCountry: string;
    senderName: string;
    exHouseOid: string;
    exHouseName: string;
}
export interface IRecipientDetails {
    oid: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nidVerification: string;
    email: string;
    currentVersion:string;
    mobileNoList: IMobile[];
    photoContent: string;
    fingerprint: IFingerprintData;
    photoIdList: IPhotoId[];
    presentAddress: IAddress;
    permanentAddress: IAddress;
    isNewRecipientSocialMedia: string;
    socialMediaJson: ISocialMediaJson;
}
export interface ISenderDetails {
    oid: string;
    fullName: string;
    gender: string;
    mobileNoOverseas: string;
    permanentAddress: IAddress;
    residenceCity: string;
    residenceCountry: string;
    isNewSenderSocialMedia: string;
    socialMediaJson: ISocialMediaJson;
}
export interface IMobile {
    mobileNo: string;
    isMobileNoVerified: string;
}
export interface ISender {
    fullName: string;
    residenceCountry: string;
    gender: string;
    mobileNoOverseas: string;
    permanentAddress: ISPermanentAddress;
    residenceCity: string;
    socialMediaFlag: string;
    socialMediaJson: ISocialMediaJson;
    senderIdAdd: string;
    senderAddFlag: string;
    senderEditFlag: string
}
export interface ISPermanentAddress {
    addressLine1: string;
    addressLine2: string;
    districtGeocode: string;
    //districtName: string;
    divisionGeocode: string;
    //divisionName: string;
    upazillaGeocode: string;
    //upazillaName: string;
    unionGeocode: string;
    //unionName: string;
}
export interface IPhotoId {
    photoIdFront: string;
    photoIdBack: string;
    photoIdNo: string;
    photoIdType: string;
    photoIdAddFlag: string;
    photoIdEditFlag: string;
}

export interface IFingerprintData {
    fpDeviceModelOid: string;
    fpDeviceOid: string;
    fpDeviceMnemonic: string;
    clientSideSdk: string;
    serverSideSdk: string;
    defaultFinger: string;
    fpDetails: IFpDetails;
    ri: any;
    rm: any;
    rt: any;
    rr: any;
    rp: any;
    li: any;
    lm: any;
    lt: any;
    lr: any;
    lp: any;
    riMeta: any;
    rmMeta: any;
    rtMeta: any;
    rrMeta: any;
    rpMeta: any;
    liMeta: any;
    lmMeta: any;
    ltMeta: any;
    lrMeta: any;
    lpMeta: any;
}
export interface IFpDetails {
    ri: string;
    rm: string;
    rt: string;
    rr: string;
    rp: string;
    li: string;
    lm: string;
    lt: string;
    lr: string;
    lp: string;
}