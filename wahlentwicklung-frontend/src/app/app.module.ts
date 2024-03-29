import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AppRoutingModule, ROUTES} from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from "@angular/forms";
import { LandingpageComponent } from './sites/landingpage/landingpage.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ElectionResultSectionComponent } from './sections/election-result-section/election-result-section.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { BarChartModule } from "@swimlane/ngx-charts";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { FooterComponent } from './components/footer/footer.component';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { GeneralStatisticSection } from './sections/general-statistic-section/general-statistic-section';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { BellwetherStateSectionComponent } from './sections/bellwether-state-section/bellwether-state-section.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {provideRouter} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingpageComponent,
    ElectionResultSectionComponent,
    FooterComponent,
    HeroSectionComponent,
    GeneralStatisticSection,
    BellwetherStateSectionComponent,
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
        MatRadioModule,
        MatTooltipModule
    ],
  providers: [provideRouter(ROUTES)],
  bootstrap: [AppComponent]
})
export class AppModule {
}
