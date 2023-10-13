import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {TestSiteComponent} from "./test-site/test-site.component";

const routes: Routes = [
  { path: '', component: TestSiteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
