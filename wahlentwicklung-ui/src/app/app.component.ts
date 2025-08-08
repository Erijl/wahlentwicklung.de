import { Component } from '@angular/core';
import { ElectionListComponent } from './election-list/election-list.component';

@Component({
  selector: 'app-root',
  imports: [ElectionListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wahlentwicklung-ui';
}
