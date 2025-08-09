import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ElectionService } from '../election.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-states-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-8">
      <header class="mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Bundesländer</h1>
        <p class="text-gray-600">Alle deutschen Bundesländer in der Datenbank</p>
      </header>

      <div class="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div class="flex-1">
          <label class="block text-sm text-gray-600 mb-1">Suche</label>
          <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="Bundesland..." [(ngModel)]="query">
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
          <a *ngFor="let s of filteredStates()" [routerLink]="['/state', s.name]" class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow">
            <div class="font-semibold text-gray-800">{{ s.name }}</div>
          </a>
        </div>
        <div *ngSwitchDefault class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="text-left text-gray-600">
              <tr><th class="py-2 pr-4">Bundesland</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of filteredStates()" class="border-t">
                <td class="py-2 pr-4"><a [routerLink]="['/state', s.name]" class="text-blue-700 hover:underline">{{ s.name }}</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </div>
  `,
})
export class StatesListComponent implements OnInit {
  private svc = inject(ElectionService);
  states = signal<Array<{ id: number; name: string }>>([]);
  viewMode: 'cards' | 'table' = 'cards';
  query = '';

  filteredStates = computed(() => {
    const q = this.query.toLowerCase().trim();
    return this.states().filter((s) => s.name.toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));
  });

  ngOnInit(): void {
    this.svc.getStates().subscribe((rows) => this.states.set(rows));
  }
}


