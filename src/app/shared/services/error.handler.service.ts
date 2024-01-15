import { Injectable, ErrorHandler } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
//import { ErrorObservable } from "rxjs";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor() {
  }
  public handleError(error: HttpErrorResponse) {
    //if (error.error instanceof ErrorEvent) {
    //  // A client-side or network error occurred. Handle it accordingly.
    //  console.error('An error occurred:', error.error.message);
    //} else {
    //  // The backend returned an unsuccessful response code.
    //  // The response body may contain clues as to what went wrong,
    //  console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    //}
    //// return an ErrorObservable with a user-facing error message
    ////We are unable to retrieve the "tutorial/toh-pt4" page at this time. Please check your connection and try again later. 
    //return new ErrorObservable('Something bad happened; Please try again later.');
  };

  

}