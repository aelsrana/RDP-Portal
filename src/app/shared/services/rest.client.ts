import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { AUTH_STORE_KEY } from "../index";
import { Observable } from "rxjs";
import { AppStorageService } from "./index";

@Injectable()
export class RestClient {

    constructor(private _http: HttpClient, private _appStorageService: AppStorageService) { }

    private _headers(): any {
        let token = this._appStorageService.getData(AUTH_STORE_KEY);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
                //'Authorization': 'Bearer ' + 'a6018860-a325-477a-a77f-9c62386e5d24'
            })
        };

        return httpOptions;
    }

    getFromFile(url: string): any {
        return this._http.get(url, this._headers());
    }

    get(url: string): any {
        try {
            return this._http.get(url, this._headers());
        } catch (err) {
            return Observable.throw(err.message);
        }
    }

    post(url: string, data: any): Observable<any> {
        try {
            return this._http.post<any>(url, data, this._headers());
        } catch (err) {
            return Observable.throw(err.message);
        }
    }
}