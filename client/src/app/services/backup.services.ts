import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { GLOBAL } from './global';
import { BackupRecords } from '../models/backup-records';
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

    registerBackup(backup: BackupRecords): Observable<any>{
        let params = JSON.stringify(backup);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.token);

        return this._http.post(this.url + 'backup-register', params, {headers: headers});

    }

    

}