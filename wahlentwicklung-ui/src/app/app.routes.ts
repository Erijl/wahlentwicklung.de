import { Routes } from '@angular/router';
import { ElectionListComponent } from './election-list/election-list.component';
import { ElectionDetailComponent } from './election-detail/election-detail.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';

export const routes: Routes = [
  {
    path: 'elections',
    component: ElectionListComponent
  },
  {
    path: '',
    redirectTo: '/elections',
    pathMatch: 'full'
  },
  {
    path: 'election/:year',
    component: ElectionDetailComponent
  },
  { path: 'states', component: PlaceholderComponent },
  { path: 'parties', component: PlaceholderComponent },
  { path: 'constituencies', component: PlaceholderComponent },
];
