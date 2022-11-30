import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { JsonPipe } from "@angular/common";
import { User } from '../../models/user';
import { BackupRegister } from '../../models/backup-register';
import { UserService } from "src/app/services/user.services";
import { HomeService } from "src/app/services/home.services";

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
    public title:string;
    public page:any;
    public total:string;
    public pages:string;
    public itemsPerPage:any;
    public status:string;
    public registers: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _homeService: HomeService
    ){
        this.title = 'Registro de Cintas';
        this.page = 1;
        this.total = '';
        this.pages = '';
        this.itemsPerPage = 3;
        this.status = 'null';
        this.registers;
    }

    ngOnInit(){
        console.log('home.component cargado');
        this.getRegisters();
    }


    getRegisters() {
        this._homeService.getRegister().subscribe(
          response => {
            if (response.registers) {
              console.log(response);
              this.registers = response.registers;
    
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