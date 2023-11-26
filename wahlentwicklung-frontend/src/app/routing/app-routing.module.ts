import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LandingpageComponent} from "../sites/landingpage/landingpage.component";

const routes: Routes = [
  { path: '', component: LandingpageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
