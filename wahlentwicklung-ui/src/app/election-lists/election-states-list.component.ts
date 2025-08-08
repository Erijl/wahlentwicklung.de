import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ElectionService } from '../election.service';

@Component({
  selector: 'app-election-states-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto p-8">
      <a routerLink="/election/{{ year() }}" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">← Zurück zur Wahl</a>
      <header class="mt-4 mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Bundesländer ({{ year() }})</h1>
        <p class="text-gray-600">Alle Bundesländer dieser Wahl</p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <a *ngFor="let s of states()" [routerLink]="['/election', year(), s.name, 'constituencies']" class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow">
          <div class="font-semibold text-gray-800">{{ s.name }}</div>
        </a>
      </div>
    </div>
  `,
})
export class ElectionStatesListComponent implements OnInit {
  private svc = inject(ElectionService);
  private route = inject(ActivatedRoute);
  year = signal<number>(0);
  states = signal<Array<{ row_id: number; name: string }>>([]);

  ngOnInit(): void {
    const y = Number(this.route.snapshot.paramMap.get('year'));
    this.year.set(y);
    this.svc.getElectionStates(y).subscribe((rows) => this.states.set(rows));
  }
}


