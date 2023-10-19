import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { HeaderComponent } from './components/header/header.component';
import { BundeslaenderListComponent } from './components/bundeslaender-list/bundeslaender-list.component';
import { ParteiListComponent } from './components/partei-list/partei-list.component';
import {FormsModule} from "@angular/forms";
import { LandingpageComponent } from './sites/landingpage/landingpage.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import { BundeslandMultiSelectComponent } from './components/bundesland-multi-select/bundesland-multi-select.component';
import { ParteiMultiSelectComponent } from './components/partei-multi-select/partei-multi-select.component';
import { WahlResultComponent } from './components/wahl-result/wahl-result.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BundeslaenderListComponent,
    ParteiListComponent,
    LandingpageComponent,
    BundeslandMultiSelectComponent,
    ParteiMultiSelectComponent,
    WahlResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
