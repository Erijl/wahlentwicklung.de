import { Routes } from '@angular/router';
import { ElectionListComponent } from './election-list/election-list.component';
import { ElectionDetailComponent } from './election-detail/election-detail.component';
import { StatesListComponent } from './lists/states-list.component';
import { PartiesListComponent } from './lists/parties-list.component';
import { ConstituenciesListComponent } from './lists/constituencies-list.component';
import { ElectionStatesListComponent } from './election-lists/election-states-list.component';
import { ElectionConstituenciesByStateComponent } from './election-lists/election-constituencies-by-state.component';

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
  { path: 'states', component: StatesListComponent },
  { path: 'parties', component: PartiesListComponent },
  { path: 'constituencies', component: ConstituenciesListComponent },
  { path: 'election/:year/states', component: ElectionStatesListComponent },
  { path: 'election/:year/:state/constituencies', component: ElectionConstituenciesByStateComponent },
];
