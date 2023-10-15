import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {TestSiteComponent} from "./test-site/test-site.component";
import {LandingpageComponent} from "./sites/landingpage/landingpage.component";

const routes: Routes = [
  { path: '', component: TestSiteComponent },
  { path: 'landingpage', component: LandingpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
