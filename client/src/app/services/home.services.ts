import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { UserService } from '../services/user.services';


@Injectable()
export class HomeService{
    public url: string;
    public identity: any;
    public token: any;

    constructor(
        public _http: HttpClient,
        private _userService: UserService,
        
    ){
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.gettoken();

    }

    // gettoken(){
    //     let token = localStorage.getItem('token');

    //     if(token != "undefined"){
    //         this.token = token;
    //     }else{
    //         this.token = null;
    //     }

    //     return this.token;
    // }

    getRegister(page:any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.token);

        return this._http.get(this.url + 'get-register/' + page, {headers: headers});
    }

    getAllRegister(page:any, ipp:any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.token);

        return this._http.get(this.url + 'get-register/' + page + '/' + ipp, {headers: headers});
    }

    getAvalibleTapes(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.token);

        return this._http.get(this.url + 'avalible-tapes/', {headers: headers});
    }


}