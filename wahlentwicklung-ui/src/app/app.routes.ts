import { Routes } from '@angular/router';
import { ElectionListComponent } from './election-list/election-list.component';
import { ElectionDetailComponent } from './election-detail/election-detail.component';
import { StatesListComponent } from './lists/states-list.component';
import { PartiesListComponent } from './lists/parties-list.component';
import { ConstituenciesListComponent } from './lists/constituencies-list.component';
import { ElectionStatesListComponent } from './election-lists/election-states-list.component';
import { ElectionConstituenciesByStateComponent } from './election-lists/election-constituencies-by-state.component';
import { ElectionConstituenciesListComponent } from './election-lists/election-constituencies-list.component';
import { ElectionOneStatComponent } from './election-one-stat/election-one-stat.component';
import { DevelopmentComponent } from './development/development.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
  // redirects per README
  { path: 'constituency', redirectTo: '/constituencies', pathMatch: 'full' },
  { path: 'state', redirectTo: '/states', pathMatch: 'full' },
  { path: 'party', redirectTo: '/parties', pathMatch: 'full' },
  { path: 'election', redirectTo: '/elections', pathMatch: 'full' },
  {
    path: 'election/:year',
    component: ElectionDetailComponent
  },
  { path: 'states', component: StatesListComponent },
  { path: 'parties', component: PartiesListComponent },
  { path: 'constituencies', component: ConstituenciesListComponent },
  { path: 'election/:year/states', component: ElectionStatesListComponent },
  { path: 'election/:year/constituencies', component: ElectionConstituenciesListComponent },
  { path: 'election/:year/:state/constituencies', component: ElectionConstituenciesByStateComponent },
  // one-stat endpoints (placeholders; content to be filled)
  { path: 'election/:year/stat', component: ElectionOneStatComponent },
  { path: 'election/:year/:state/stat', component: ElectionOneStatComponent },
  { path: 'election/:year/:state/:constituency/stat', component: ElectionOneStatComponent },
  { path: 'election/:year/party/:party', component: ElectionOneStatComponent },
  { path: 'election/:year/:state/party/:party', component: ElectionOneStatComponent },
  { path: 'election/:year/:state/:constituency/party/:party', component: ElectionOneStatComponent },
  // development endpoints
  { path: 'party/:name', component: DevelopmentComponent },
  { path: 'state/:name', component: DevelopmentComponent },
  { path: 'constituency/:name', component: DevelopmentComponent },
  // 404
  { path: '**', component: NotFoundComponent },
];
