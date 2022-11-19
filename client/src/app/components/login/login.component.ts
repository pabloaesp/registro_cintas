import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from "src/app/services/user.services";
import { JsonPipe } from "@angular/common";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit{
    public title: string;
    public user: User;
    public status: string;
    public identity: any;
    public token: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService

    ){
        this.title = 'Identificate'
        this.status = 'null';
        this.user = new User("","","","","","ROLE_USER","");
    }

    ngOnInit() {
        console.log('Componente de login cargado');
    }

}