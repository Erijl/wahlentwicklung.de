import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ElectionService } from '../election.service';

@Component({
  selector: 'app-election-constituencies-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto p-8">
      <a routerLink="/election/{{ year() }}" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">← Zurück zur Wahl</a>
      <header class="mt-4 mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Wahlkreise ({{ year() }})</h1>
        <p class="text-gray-600">Alle Wahlkreise dieser Wahl</p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div *ngFor="let c of constituencies()" class="bg-white border border-gray-200 rounded-xl p-4">
          <div class="font-semibold text-gray-800">{{ c.name }}</div>
          <div class="text-sm text-gray-600">State-Row-ID: {{ c.state_row_id }}</div>
        </div>
      </div>
    </div>
  `,
})
export class ElectionConstituenciesListComponent implements OnInit {
  private svc = inject(ElectionService);
  private route = inject(ActivatedRoute);
  year = signal<number>(0);
  constituencies = signal<Array<{ state_row_id: number; name: string }>>([]);

  ngOnInit(): void {
    const y = Number(this.route.snapshot.paramMap.get('year'));
    this.year.set(y);
    this.svc.getElectionConstituencies(y).subscribe((rows) => this.constituencies.set(rows));
  }
}


