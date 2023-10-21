import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LandingpageComponent} from "../sites/landingpage/landingpage.component";
import {TestAreaComponent} from "../sites/test-area/test-area.component";

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'test', component: TestAreaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
