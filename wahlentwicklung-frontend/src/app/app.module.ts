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
import {BarChartModule} from "@swimlane/ngx-charts";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatButtonModule} from "@angular/material/button";
import { TestAreaComponent } from './sites/test-area/test-area.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './sections/hero/hero.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import { GeneralStatsComponent } from './sections/general-stats/general-stats.component';
import { BundeslandStatsComponent } from './sections/bundesland-stats/bundesland-stats.component';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BundeslaenderListComponent,
    ParteiListComponent,
    LandingpageComponent,
    BundeslandMultiSelectComponent,
    ParteiMultiSelectComponent,
    WahlResultComponent,
    TestAreaComponent,
    FooterComponent,
    HeroComponent,
    GeneralStatsComponent,
    BundeslandStatsComponent
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
    MatSortModule,
    BarChartModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
