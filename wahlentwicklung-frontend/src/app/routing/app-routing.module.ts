import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingpageComponent } from "../sites/landingpage/landingpage.component";
import {DetailspageComponent} from "../sites/detailspage/detailspage.component";
import {
  ElectionresultDetailsPageComponent
} from "../sites/electionresult-details-page/electionresult-details-page.component";

export const ROUTES: Routes = [
  {path: '', component: LandingpageComponent},
  {path: 'details', component: DetailspageComponent}, //Overview of all detail possibilites
  {path: 'details/electionresult', component: ElectionresultDetailsPageComponent},
  {path: 'details/bellwether', component: LandingpageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
