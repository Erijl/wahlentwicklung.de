import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ElectionService } from '../election.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-constituencies-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-8">
      <header class="mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Wahlkreise</h1>
        <p class="text-gray-600">Alle Wahlkreise mit zugehörigem Bundesland</p>
      </header>

      <div class="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div class="flex-1">
          <label class="block text-sm text-gray-600 mb-1">Suche</label>
          <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="Wahlkreis..." [(ngModel)]="query">
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="text-left text-gray-600">
            <tr>
              <th class="py-2 pr-4">Wahlkreis</th>
              <th class="py-2 pr-4">State-ID</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filtered()" class="border-t">
              <td class="py-2 pr-4">{{ c.name }}</td>
              <td class="py-2 pr-4">{{ c.state_id }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ConstituenciesListComponent implements OnInit {
  private svc = inject(ElectionService);
  constituencies = signal<Array<{ id: number; state_id: number; name: string }>>([]);
  query = '';

  filtered = computed(() => {
    const q = this.query.toLowerCase().trim();
    return this.constituencies().filter((c) => c.name.toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));
  });

  ngOnInit(): void {
    this.svc.getConstituencies().subscribe((rows) => this.constituencies.set(rows));
  }
}


