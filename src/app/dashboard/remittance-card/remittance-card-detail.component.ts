import { GrowlMessageService } from './../../shared/services/growl.message.service';
import { Person } from './../../shared/model/model/person';
import { RemittanceCardService } from './remittance-card.service';
import { Component, OnInit, Input, OnDestroy, AfterViewInit } from "@angular/core";
import { routerTransition } from "src/app/router.animations";
import { ActivatedRoute, Params } from "@angular/router";
import { AuthService } from "src/app/shared/guard";
import { AppStorageService } from 'src/app/shared/services';
import { Location} from "@angular/common";
import { LoaderService } from "src/app/shared/services/loader.service";
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';
import { SendEmail } from 'src/app/shared/model/model/send-email';


@Component({
    templateUrl: './remittance-card-detail.component.html',
    styleUrls: ['./remittance-card.component.css'],
    animations: [routerTransition()]
  })
  
  export class RemittanceCardDetailComponent implements OnInit {
    
    
    public userInfo:any;
    public personInfo: Person
    @Input() public msgs: Array<any> = [];
    public elementType : 'url' | 'canvas' | 'img' = 'url';
    public value : string = '';
    public data; userPhoto; id: any;
    public showSendEmailModal:boolean;
    public emailInfo: any;
    public sendEmail:SendEmail = new SendEmail();

    constructor(private activatedRoute: ActivatedRoute,  public authService: AuthService, private location: Location, private remittanceCardService: RemittanceCardService,
        private messagesService: GrowlMessageService, private loaderService: LoaderService, private _appStorageService: AppStorageService, private _sanitizer: DomSanitizer ){  
        this.userInfo = this.authService.getAuthInfo();
        this.id = this.activatedRoute.snapshot.params['oid'];
        this.emailInfo = {email: null, otherEmail: null, fileName:null}
    }


    getPersonInfoByOid(){
        this.loaderService.display(true);
        this.remittanceCardService.getByOid(this.id).subscribe(result=>{
            this.loaderService.display(false);
            if (result != null && result.header.responseCode == '200') {
                this.personInfo= result['body']['data'];
                this.userPhoto = this._sanitizer.bypassSecurityTrustUrl("data:image/jpg;base64,"+this.personInfo.photoContent);
                this.emailInfo.email = this.personInfo.email;
            }else {
                this.msgs = this.messagesService.showInfo(result.header.responseMessage);
                setTimeout(() => {
                  this.msgs = this.messagesService.clear();
                }, 3000);
              }
        })
    }

    //  hexToBase64(hexstring) {
    //     return btoa(hexstring.match(/\w{2}/g).map(function(a) {
    //         return String.fromCharCode(parseInt(a, 16));
    //     }).join(""));
    // }
    

    printClick(){
        window.print();
    }
    
    emailClick(){
         this.showSendEmailModal =true;
         
    }

    sendEmailClick(){
        if(!this.emailInfo.email){
            this.showSendEmailModal =true;
            return;
         }
         this.loaderService.display(true);
         this.pdfClick()
         this.sendEmail.fileName = this.personInfo.oid;
         this.sendEmail.emailTo.push(this.emailInfo.email);
         if(this.emailInfo.otherEmail)this.sendEmail.emailTo.push(this.emailInfo.otherEmail);
         this.remittanceCardService.sendEmail(this.sendEmail).subscribe(result=>{
             this.loaderService.display(false);
             this.showSendEmailModal =false;
             if (result != null && result.header.responseCode == '200') {
                this.msgs = this.messagesService.showSuccess(result.header.responseMessage);
                setTimeout(() => {
                    this.msgs = this.messagesService.clear();
                    this.goBack();
                }, 5000);
                
             }else {
                 this.msgs = this.messagesService.showInfo(result.header.responseMessage);
                 setTimeout(() => {
                   this.msgs = this.messagesService.clear();
                 }, 5000);
             }
         })
    }

    cancel(){
        this.userInfo.email=null;
        this.userInfo.otherEmail=null;
        this.showSendEmailModal =false;
    }

    pdfClick(){
        var data = document.getElementById('print-section');
        html2canvas(data).then(canvas => {  
          var imgWidth = 208;   
          var pageHeight = 295;    
          var imgHeight = canvas.height * imgWidth / canvas.width;  
          var heightLeft = imgHeight;  
          const contentDataURL = canvas.toDataURL('image/png')  
          let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
          var position = 0;  
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
          pdf.save(this.personInfo.oid +'.pdf'); // Generated PDF   
        });  
    }

    goBack(){
        this.location.back();
    }
    
    ngOnInit(): void {
        this.getPersonInfoByOid();
    }
      
  }