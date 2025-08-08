import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ElectionService } from '../election.service';

@Component({
  selector: 'app-constituencies-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto p-8">
      <header class="mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Wahlkreise</h1>
        <p class="text-gray-600">Alle Wahlkreise mit zugehörigem Bundesland</p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div *ngFor="let c of constituencies()" class="bg-white border border-gray-200 rounded-xl p-4">
          <div class="font-semibold text-gray-800">{{ c.name }}</div>
          <div class="text-sm text-gray-600">State-ID: {{ c.state_id }}</div>
        </div>
      </div>
    </div>
  `,
})
export class ConstituenciesListComponent implements OnInit {
  private svc = inject(ElectionService);
  constituencies = signal<Array<{ id: number; state_id: number; name: string }>>([]);

  ngOnInit(): void {
    this.svc.getConstituencies().subscribe((rows) => this.constituencies.set(rows));
  }
}


