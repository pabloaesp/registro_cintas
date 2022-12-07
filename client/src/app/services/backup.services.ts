import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { GLOBAL } from './global';
// import { Backup } from '../models/backup';
import { UserService } from '../services/user.services';


@Injectable()
export class BackupService{
    public url: string;
    public token: any;

    constructor(
        public _http: HttpClient,
        private _userService: UserService,
        
    ){
        this.url = GLOBAL.url;
        this.token = this._userService.gettoken();

    }


    getBackups(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.token);

        return this._http.get(this.url + 'backups/', {headers: headers});

    }

    

}