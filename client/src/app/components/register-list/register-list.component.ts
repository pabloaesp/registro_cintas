import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HomeService } from "src/app/services/home.services";

@Component({
  selector: 'app-register-list',
  templateUrl: './register-list.component.html'
})
export class RegisterListComponent {
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
        this.itemsPerPage = 20;
        this.status = 'null';
        this.registers;
    }

    ngOnInit(){
        console.log('home.component cargado');
        this.getAllRegisters(this.page, this.itemsPerPage);
    }


    getAllRegisters(page:any, ipp:any = this.itemsPerPage) {
        this._homeService.getAllRegister(page, ipp).subscribe(
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

        this.getAllRegisters(this.page);
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

        this.getAllRegisters(this.page);
    }
}
