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
        // this.itemsPerPage = 3;
        this.status = 'null';
        this.registers;
    }

    ngOnInit(){
        console.log('home.component cargado');
        this.getRegisters(this.page);
    }


    getRegisters(page:any) {
        this._homeService.getRegister(page).subscribe(
            response => {
                if (response.registers) {
                    console.log(response.registers);
                    this.total = response.total;
                    this.pages = response.pages;
                    this.registers = response.registers;
                    // console.log(this.registers);

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

    // Creando flags para los botones de pasar paginas
    public noLess = false;
    public noMore = false;
        
    viewLess() {
        this.page -= 1;

        if (this.page == 1) {
            this.noLess = false;
            this.noMore = false;
        }

        console.log('page ' + this.page);
        console.log('pages ' + this.pages);
        console.log('total ' + this.total);

        this.getRegisters(this.page);
    }

    viewMore() {
        this.page += 1;

        if (this.page >= 2) {
            this.noLess = true;
        }

        if (this.page == this.pages) {
            this.noMore = true;
        }

        if (this.page == 1) {
            this.noLess = false;
        }

        console.log('page ' + this.page);
        console.log('pages ' + this.pages);
        console.log('total ' + this.total);

        this.getRegisters(this.page);
    }

}