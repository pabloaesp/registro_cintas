import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { BackupRecords } from "src/app/models/backup-records";

import { UserService } from "src/app/services/user.services";
import { BackupService } from "src/app/services/backup.services";
import { TapeService } from "src/app/services/tape.services";
import { Form } from "@angular/forms";

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: []
})
export class RegisterComponent implements OnInit{
    public title: string;
    public identity: any;
    public backups: any;
    public backup: any;
    public tapes: any;
    public status: any;
    public bkRecord: BackupRecords;
    public nombreCompleto: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _backupService: BackupService,
        private _tapeService: TapeService

    ){
        this.title = 'Registrar un respaldo'
        this.identity = '';
        this.bkRecord = new BackupRecords("","","","","","","","");
    }
    
    ngOnInit() {
        console.log('Componente de registro cargado');
        this.identity = JSON.parse(this._userService.getIdentity());
        this.nombreCompleto = this.identity.name + ' ' + this.identity.surname; 
        this.getBackups();
        this.getAvalibleTapes();
    }

    onSubmit(form:any){
        this._backupService.registerBackup(this.bkRecord).subscribe(
            response => {
                if(response){
                    console.log(response);
        
                    this.status = 'success';
                    form.reset();
                    this.nombreCompleto;
                    this._router.navigate(['/home']);
                    
                }else{
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
            }
        );
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




