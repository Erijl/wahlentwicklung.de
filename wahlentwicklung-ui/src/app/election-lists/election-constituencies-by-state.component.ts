import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ElectionService } from '../election.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-election-constituencies-by-state',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-8">
      <a routerLink="/election/{{ year() }}" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">← Zurück zur Wahl</a>
      <header class="mt-4 mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">{{ stateName() }} – Wahlkreise ({{ year() }})</h1>
        <p class="text-gray-600">Alle Wahlkreise des Bundeslandes in dieser Wahl</p>
      </header>

      <div class="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div class="flex-1">
          <label class="block text-sm text-gray-600 mb-1">Suche</label>
          <input type="text" class="w-full border rounded-lg px-3 py-2" placeholder="Wahlkreis..." [(ngModel)]="query">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ansicht</label>
          <div class="flex gap-2">
            <button (click)="viewMode = 'cards'" [class.bg-gray-900]="viewMode==='cards'" [class.text-white]="viewMode==='cards'" class="px-3 py-1.5 rounded border">Karten</button>
            <button (click)="viewMode = 'big'" [class.bg-gray-900]="viewMode==='big'" [class.text-white]="viewMode==='big'" class="px-3 py-1.5 rounded border">Groß</button>
            <button (click)="viewMode = 'table'" [class.bg-gray-900]="viewMode==='table'" [class.text-white]="viewMode==='table'" class="px-3 py-1.5 rounded border">Tabelle</button>
          </div>
        </div>
      </div>

      <ng-container [ngSwitch]="viewMode">
        <div *ngSwitchCase="'cards'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div *ngFor="let c of filtered()" class="bg-white border border-gray-200 rounded-xl p-4">
            <div class="font-semibold text-gray-800">{{ c.name }}</div>
            <div class="mt-2 h-1 bg-gray-100 rounded overflow-hidden flex">
              <div *ngFor="let p of c.topParties" [style.width.%]="p.pct" [style.backgroundColor]="p.color" class="h-1"></div>
            </div>
          </div>
        </div>
        <div *ngSwitchCase="'big'" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div *ngFor="let c of filtered()" class="bg-white border border-gray-200 rounded-2xl p-6">
            <div class="text-xl font-bold text-gray-900">{{ c.name }}</div>
            <div class="mt-3 text-sm text-gray-600">Wahlbeteiligung: {{ c.turnout | number:'1.0-1' }}%</div>
            <div class="mt-3 h-2 bg-gray-100 rounded overflow-hidden flex">
              <div *ngFor="let p of c.topParties" [style.width.%]="p.pct" [style.backgroundColor]="p.color" class="h-2"></div>
            </div>
          </div>
        </div>
        <div *ngSwitchDefault class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="text-left text-gray-600">
              <tr>
                <th class="py-2 pr-4">Wahlkreis</th>
                <th class="py-2 pr-4">Wahlbeteiligung</th>
                <th class="py-2 pr-4">Top-Parteien (≥4%)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of filtered()" class="border-t">
                <td class="py-2 pr-4">{{ c.name }}</td>
                <td class="py-2 pr-4">{{ c.turnout | number:'1.0-1' }}%</td>
                <td class="py-2 pr-4">
                  <span *ngFor="let p of c.topParties" class="inline-flex items-center gap-1 mr-2 text-xs px-2 py-0.5 rounded"
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
export class ElectionConstituenciesByStateComponent implements OnInit {
  private svc = inject(ElectionService);
  private route = inject(ActivatedRoute);
  year = signal<number>(0);
  stateName = signal<string>('');
  constituencies = signal<Array<{ name: string }>>([]);
  enriched = signal<Array<{ name: string; turnout: number; topParties: Array<{ label: string; pct: number; color: string }> }>>([]);

  viewMode: 'cards' | 'big' | 'table' = 'cards';
  query = '';

  ngOnInit(): void {
    const y = Number(this.route.snapshot.paramMap.get('year'));
    const s = decodeURIComponent(this.route.snapshot.paramMap.get('state') ?? '');
    this.year.set(y);
    this.stateName.set(s);
    this.svc.getElectionConstituenciesByStateName(y, s).subscribe((rows) => {
      this.constituencies.set(rows);
      const promises = rows.map(async (c) => ({
        name: c.name,
        turnout: await this.fetchConstituencyTurnout(y, s, c.name),
        topParties: await this.fetchConstituencyShares(y, s, c.name),
      }));
      Promise.all(promises).then((vals) => this.enriched.set(vals));
    });
  }

  filtered = computed(() => {
    const q = this.query.toLowerCase().trim();
    return this.enriched().filter((c) => c.name.toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));
  });

  private async fetchConstituencyTurnout(year: number, stateName: string, name: string): Promise<number> {
    try {
      const Database = require('better-sqlite3');
      const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
      const state = db.prepare('SELECT row_id FROM election_state WHERE election_year = ? AND name = ?').get(year, stateName) as { row_id: number } | undefined;
      if (!state) { db.close(); return 0; }
      const c = db.prepare('SELECT row_id FROM election_constituency WHERE election_year = ? AND state_id = ? AND name = ?').get(year, state.row_id, name) as { row_id: number } | undefined;
      if (!c) { db.close(); return 0; }
      const base = db.prepare('SELECT actualvoters_secondaryvote_definitive AS actual, eligiblevoters_secondaryvote_definitive AS eligible FROM constituency_vote_base WHERE election_year = ? AND state_id = ? AND constituency_id = ?').get(year, state.row_id, c.row_id) as { actual: number; eligible: number } | undefined;
      db.close();
      if (!base || !base.eligible) return 0;
      return (base.actual / base.eligible) * 100;
    } catch { return 0; }
  }

  private async fetchConstituencyShares(year: number, stateName: string, name: string): Promise<Array<{ label: string; pct: number; color: string }>> {
    try {
      const Database = require('better-sqlite3');
      const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
      const state = db.prepare('SELECT row_id FROM election_state WHERE election_year = ? AND name = ?').get(year, stateName) as { row_id: number } | undefined;
      if (!state) { db.close(); return []; }
      const c = db.prepare('SELECT row_id FROM election_constituency WHERE election_year = ? AND state_id = ? AND name = ?').get(year, state.row_id, name) as { row_id: number } | undefined;
      if (!c) { db.close(); return []; }
      const totalRow = db.prepare('SELECT SUM(secondaryvote_definitive) AS total FROM constituency_vote_party WHERE election_year = ? AND state_id = ? AND constituency_id = ?').get(year, state.row_id, c.row_id) as { total: number } | undefined;
      const total = totalRow?.total || 0;
      if (!total) { db.close(); return []; }
      const rows = db.prepare(`
        SELECT IFNULL(p.abbreviation, ep.name) AS label,
               IFNULL('#' || p.color, '#60a5fa') AS color,
               cvp.secondaryvote_definitive * 1.0 / ? * 100 AS pct
        FROM constituency_vote_party cvp
        JOIN election_party ep ON ep.election_year = cvp.election_year AND ep.column_index = cvp.party_id
        LEFT JOIN party_mapping pm ON pm.election_year = ep.election_year AND pm.column_index = ep.column_index
        LEFT JOIN party p ON p.id = pm.party_id
        WHERE cvp.election_year = ? AND cvp.state_id = ? AND cvp.constituency_id = ?
        ORDER BY pct DESC
      `).all(total, year, state.row_id, c.row_id) as Array<{ label: string; color: string; pct: number }>;
      db.close();
      return rows.filter(r => r.pct >= 4).map(r => ({ label: r.label, pct: r.pct, color: r.color }));
    } catch { return []; }
  }
}


