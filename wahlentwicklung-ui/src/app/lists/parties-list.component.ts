import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ElectionService } from '../election.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parties-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-8">
      <header class="mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Parteien</h1>
        <p class="text-gray-600">Alle Parteien mit Metadaten</p>
      </header>

      <div class="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div class="flex-1">
          <label class="block text-sm text-gray-600 mb-1">Suche</label>
          <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="Partei..." [(ngModel)]="query">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ansicht</label>
          <div class="flex gap-2">
            <button (click)="viewMode = 'cards'" [class.bg-gray-900]="viewMode==='cards'" [class.text-white]="viewMode==='cards'" class="px-3 py-1.5 rounded border">Karten</button>
            <button (click)="viewMode = 'table'" [class.bg-gray-900]="viewMode==='table'" [class.text-white]="viewMode==='table'" class="px-3 py-1.5 rounded border">Tabelle</button>
          </div>
        </div>
      </div>

      <ng-container [ngSwitch]="viewMode">
        <div *ngSwitchCase="'cards'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a *ngFor="let p of filtered()" [routerLink]="['/party', p.abbreviation || p.name]" class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full" [style.backgroundColor]="p.color ? '#' + p.color : '#cbd5e1'"></span>
              <div class="font-semibold text-gray-800">{{ p.abbreviation || p.name }}</div>
            </div>
            <div class="text-sm text-gray-600">{{ p.name }}</div>
          </a>
        </div>
        <div *ngSwitchDefault class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="text-left text-gray-600">
              <tr>
                <th class="py-2 pr-4">Partei</th>
                <th class="py-2 pr-4">Voller Name</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filtered()" class="border-t">
                <td class="py-2 pr-4"><a [routerLink]="['/party', p.abbreviation || p.name]" class="text-blue-700 hover:underline">{{ p.abbreviation || p.name }}</a></td>
                <td class="py-2 pr-4">{{ p.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </div>
  `,
})
export class PartiesListComponent implements OnInit {
  private svc = inject(ElectionService);
  parties = signal<Array<{ id: number; name: string; abbreviation?: string | null; color?: string | null }>>([]);
  viewMode: 'cards' | 'table' = 'cards';
  query = '';

  filtered = computed(() => {
    const q = this.query.toLowerCase().trim();
    return this.parties()
      .filter((p) => (p.abbreviation || p.name).toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      .sort((a, b) => (a.abbreviation || a.name).localeCompare(b.abbreviation || b.name));
  });

  ngOnInit(): void {
    this.svc.getParties().subscribe((rows) => this.parties.set(rows));
  }
}


