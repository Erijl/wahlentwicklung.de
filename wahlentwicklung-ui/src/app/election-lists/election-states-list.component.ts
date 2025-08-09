import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ElectionService } from '../election.service';
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
          <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="Bundesland..." [(ngModel)]="query">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ansicht</label>
          <div class="flex gap-2">
            <button (click)="viewMode = 'cards'" [class.bg-gray-900]="viewMode==='cards'" [class.text-white]="viewMode==='cards'" class="px-3 py-1.5 rounded border">Karten</button>
            <button (click)="viewMode = 'big'" [class.bg-gray-900]="viewMode==='big'" [class.text-white]="viewMode==='big'" class="px-3 py-1.5 rounded border">Groß</button>
            <button (click)="viewMode = 'table'" [class.bg-gray-900]="viewMode==='table'" [class.text-white]="viewMode==='table'" class="px-3 py-1.5 rounded border">Tabelle</button>
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Sortierung</label>
          <select class="border rounded-lg px-3 py-2" [(ngModel)]="sortBy">
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <ng-container [ngSwitch]="viewMode">
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
  states = signal<Array<{ row_id: number; name: string }>>([]);
  enriched = signal<Array<{ name: string; turnout: number; topParties: Array<{ label: string; pct: number; color: string }> }>>([]);

  // UI state
  viewMode: 'cards' | 'big' | 'table' = 'cards';
  query = '';
  sortBy: 'name' = 'name';

  ngOnInit(): void {
    const y = Number(this.route.snapshot.paramMap.get('year'));
    this.year.set(y);
    this.svc.getElectionStates(y).subscribe((rows) => {
      this.states.set(rows);
      // Build enriched rows with turnout and party shares (server-only simplifies during prerender)
      const promises = rows.map(async (s) => {
        // Compute turnout from state_vote_base if available; fallback to 0
        const turnout = await this.fetchStateTurnout(y, s.row_id);
        const shares = await this.fetchStateShares(y, s.row_id);
        return { name: s.name, turnout, topParties: shares };
      });
      Promise.all(promises).then((vals) => this.enriched.set(vals));
    });
  }

  filteredStates = computed(() => {
    const q = this.query.toLowerCase().trim();
    const arr = this.enriched().filter((s) => s.name.toLowerCase().includes(q));
    // Only sorting by name for now
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  });

  private async fetchStateTurnout(year: number, rowId: number): Promise<number> {
    // Access DB synchronously in prerender environment using existing service connection pattern
    try {
      // dynamic import to avoid client bundle
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Database = require('better-sqlite3');
      const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
      const base = db.prepare('SELECT actualvoters_secondaryvote_definitive AS actual, eligiblevoters_secondaryvote_definitive AS eligible FROM state_vote_base WHERE election_year = ? AND state_id = ?').get(year, rowId) as { actual: number; eligible: number } | undefined;
      db.close();
      if (!base || !base.eligible) return 0;
      return (base.actual / base.eligible) * 100;
    } catch {
      return 0;
    }
  }

  private async fetchStateShares(year: number, rowId: number): Promise<Array<{ label: string; pct: number; color: string }>> {
    try {
      const Database = require('better-sqlite3');
      const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
      const totalRow = db.prepare('SELECT SUM(secondaryvote_definitive) AS total FROM state_vote_party WHERE election_year = ? AND state_id = ?').get(year, rowId) as { total: number } | undefined;
      const total = totalRow?.total || 0;
      if (!total) { db.close(); return []; }
      const rows = db.prepare(`
        SELECT IFNULL(p.abbreviation, ep.name) AS label,
               IFNULL('#' || p.color, '#60a5fa') AS color,
               svp.secondaryvote_definitive * 1.0 / ? * 100 AS pct
        FROM state_vote_party svp
        JOIN election_party ep ON ep.election_year = svp.election_year AND ep.column_index = svp.party_id
        LEFT JOIN party_mapping pm ON pm.election_year = ep.election_year AND pm.column_index = ep.column_index
        LEFT JOIN party p ON p.id = pm.party_id
        WHERE svp.election_year = ? AND svp.state_id = ?
        ORDER BY pct DESC
      `).all(total, year, rowId) as Array<{ label: string; color: string; pct: number }>;
      db.close();
      return rows.filter(r => r.pct >= 4).map(r => ({ label: r.label, pct: r.pct, color: r.color }));
    } catch {
      return [];
    }
  }
}


