import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestSiteComponent } from './test-site/test-site.component';
import {HttpClientModule} from "@angular/common/http";
import { HeaderComponent } from './components/header/header.component';
import { BundeslaenderListComponent } from './components/bundeslaender-list/bundeslaender-list.component';
import { ParteiListComponent } from './components/partei-list/partei-list.component';
import {FormsModule} from "@angular/forms";
import { LandingpageComponent } from './sites/landingpage/landingpage.component';

@NgModule({
  declarations: [
    AppComponent,
    TestSiteComponent,
    HeaderComponent,
    BundeslaenderListComponent,
    ParteiListComponent,
    LandingpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
