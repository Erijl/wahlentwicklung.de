import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ElectionService, EnrichedState } from '../election.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-election-states-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-8">
      <a routerLink="/election/{{ year() }}" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">← Zurück zur Wahl</a>
      <header class="mt-4 mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Bundesländer ({{ year() }})</h1>
        <p class="text-gray-600">Alle Bundesländer dieser Wahl</p>
      </header>

      <div class="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div class="flex-1">
          <label class="block text-sm text-gray-600 mb-1">Suche</label>
          <!-- Change #1: Update ngModel to work with a signal -->
          <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="Bundesland..."
                 [ngModel]="query()"
                 (ngModelChange)="query.set($event)">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ansicht</label>
          <div class="flex gap-2">
            <!-- Change #2: Update click handlers and classes for signals -->
            <button (click)="viewMode.set('cards')" [class.bg-gray-900]="viewMode()=='cards'" [class.text-white]="viewMode()=='cards'" class="px-3 py-1.5 rounded border">Karten</button>
            <button (click)="viewMode.set('big')" [class.bg-gray-900]="viewMode()=='big'" [class.text-white]="viewMode()=='big'" class="px-3 py-1.5 rounded border">Groß</button>
            <button (click)="viewMode.set('table')" [class.bg-gray-900]="viewMode()=='table'" [class.text-white]="viewMode()=='table'" class="px-3 py-1.5 rounded border">Tabelle</button>
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Sortierung</label>
          <!-- ngModel also works for select, with the same pattern -->
          <select class="border rounded-lg px-3 py-2"
                  [ngModel]="sortBy()"
                  (ngModelChange)="sortBy.set($event)">
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <!-- Change #3: Read the viewMode signal in the ngSwitch -->
      <ng-container [ngSwitch]="viewMode()">
        <div *ngSwitchCase="'cards'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a *ngFor="let s of filteredStates()"
             [routerLink]="['/election', year(), s.name, 'constituencies']"
             class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow">
            <div class="font-semibold text-gray-800">{{ s.name }}</div>
            <div class="mt-2 h-1 bg-gray-100 rounded overflow-hidden flex">
              <div *ngFor="let p of s.topParties" [style.width.%]="p.pct" [style.backgroundColor]="p.color" class="h-1"></div>
            </div>
          </a>
        </div>

        <div *ngSwitchCase="'big'" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a *ngFor="let s of filteredStates()"
             [routerLink]="['/election', year(), s.name, 'constituencies']"
             class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow">
            <div class="text-xl font-bold text-gray-900">{{ s.name }}</div>
            <div class="mt-3 text-sm text-gray-600">Wahlbeteiligung: {{ s.turnout | number:'1.0-1' }}%</div>
            <div class="mt-3 h-2 bg-gray-100 rounded overflow-hidden flex">
              <div *ngFor="let p of s.topParties" [style.width.%]="p.pct" [style.backgroundColor]="p.color" class="h-2"></div>
            </div>
          </a>
        </div>

        <div *ngSwitchDefault class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="text-left text-gray-600">
            <tr>
              <th class="py-2 pr-4">Bundesland</th>
              <th class="py-2 pr-4">Wahlbeteiligung</th>
              <th class="py-2 pr-4">Top-Parteien (≥4%)</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let s of filteredStates()" class="border-t">
              <td class="py-2 pr-4">
                <a [routerLink]="['/election', year(), s.name, 'constituencies']" class="text-blue-700 hover:underline">{{ s.name }}</a>
              </td>
              <td class="py-2 pr-4">{{ s.turnout | number:'1.0-1' }}%</td>
              <td class="py-2 pr-4">
                  <span *ngFor="let p of s.topParties" class="inline-flex items-center gap-1 mr-2 text-xs px-2 py-0.5 rounded"
                        [style.backgroundColor]="p.color + '22'" [style.color]="'#111'">
                    <span class="w-1.5 h-1.5 rounded-full" [style.backgroundColor]="p.color"></span>
                    {{ p.label }} {{ p.pct | number:'1.0-1' }}%
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </div>
  `,
})
export class ElectionStatesListComponent implements OnInit {
  private svc = inject(ElectionService);
  private route = inject(ActivatedRoute);

  year = signal<number>(0);
  enriched = signal<EnrichedState[]>([]);

  viewMode = signal<'cards' | 'big' | 'table'>('cards');
  query = signal('');
  sortBy = signal<'name'>('name');

  ngOnInit(): void {
    const y = Number(this.route.snapshot.paramMap.get('year'));
    this.year.set(y);

    this.svc.getEnrichedStates(y).subscribe((data) => {
      this.enriched.set(data);
    });
  }

  filteredStates = computed(() => {
    const q = this.query().toLowerCase().trim();

    const arr = this.enriched().filter((s) => s.name.toLowerCase().includes(q));

    return arr.sort((a, b) => a.name.localeCompare(b.name));
  });
}
