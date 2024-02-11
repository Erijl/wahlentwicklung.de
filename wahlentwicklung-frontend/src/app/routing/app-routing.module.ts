import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from "../sites/landingpage/landingpage.component";

export const ROUTES: Routes = [
  {path: '', component: LandingpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
