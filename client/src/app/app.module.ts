import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './app.routing';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';



import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserService } from './services/user.services';
import { HomeService } from './services/home.services';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    MomentModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    HomeService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
