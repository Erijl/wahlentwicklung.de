import { Routes } from '@angular/router';
import { ElectionListComponent } from './election-list/election-list.component';

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
];
