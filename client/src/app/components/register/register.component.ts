import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from "src/app/services/user.services";
import { BackupService } from "src/app/services/backup.services";
import { TapeService } from "src/app/services/tape.services";

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: []
})
export class RegisterComponent implements OnInit{
    public title: string;
    public identity: any;
    public backups: any;
    public tapes: any;
    public status: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _backupService: BackupService,
        private _tapeService: TapeService

    ){
        this.title = 'Registrar un respaldo'
        this.identity = '';
    }
    
    ngOnInit() {
        console.log('Componente de registro cargado');
        this.identity = JSON.parse(this._userService.getIdentity());
        this.getBackups();
        this.getAvalibleTapes();
    }


    getBackups() {
        this._backupService.getBackups().subscribe(
            response => {
                if (response.backup) {
                    this.backups = response.backup;
                    // console.log(this.backups);

                } else {
                    this.status = 'error';
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    getAvalibleTapes() {
        this._tapeService.getAvalibleTapes().subscribe(
            response => {
                if (response.avalibleTapes) {
                    this.tapes = response.avalibleTapes;

                } else {
                    this.status = 'error';
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    
}




