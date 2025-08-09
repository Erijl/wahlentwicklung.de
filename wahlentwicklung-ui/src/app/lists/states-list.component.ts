import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ElectionService } from '../election.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-states-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto p-8">
      <header class="mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Bundesländer</h1>
        <p class="text-gray-600">Alle deutschen Bundesländer in der Datenbank</p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <a *ngFor="let s of states()" [routerLink]="['/state', s.name]" class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow">
          <div class="font-semibold text-gray-800">{{ s.name }}</div>
        </a>
      </div>
    </div>
  `,
})
export class StatesListComponent implements OnInit {
  private svc = inject(ElectionService);
  states = signal<Array<{ id: number; name: string }>>([]);

  ngOnInit(): void {
    this.svc.getStates().subscribe((rows) => this.states.set(rows));
  }
}


