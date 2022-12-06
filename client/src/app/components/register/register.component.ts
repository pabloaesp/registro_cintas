import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Tape } from '../../models/tape';
import { Backup } from '../../models/backup';
import { UserService } from "src/app/services/user.services";

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: []
})
export class RegisterComponent implements OnInit{
    public title: string;
    public identity: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService

    ){
        this.title = 'Registrar un respaldo'
        this.identity = '';
    }
    
    ngOnInit() {
        console.log('Componente de registro cargado');
        this.identity = JSON.parse(this._userService.getIdentity());
    }

    
}




