import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs-compat/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';
import { BackupRegister } from '../models/backup-register';
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

    

}