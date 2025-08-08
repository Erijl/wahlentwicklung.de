import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ElectionService } from '../election.service';
import { BarChartComponent, BarDatum } from '../charts/bar-chart.component';

type ElectionPartyView = {
  name: string;
  seat_count: number;
  part_of_coalition: boolean;
  abbreviation?: string | null;
  color?: string | null;
};

type ElectionVoteBaseView = {
  eligible_secondary_definitive: number;
  actual_secondary_definitive: number;
  valid_secondary_definitive: number;
  invalid_secondary_definitive: number;
};

@Component({
  selector: 'app-election-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BarChartComponent],
  template: `
    <div class="max-w-6xl mx-auto px-4">
      <a routerLink="/elections" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
        ← Zurück zur Übersicht
      </a>

      <header class="mt-4 mb-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">Bundestagswahl {{ year() }}</h1>
        <p class="text-gray-600 mt-1">Überblick der Ergebnisse</p>
      </header>

      <div *ngIf="voteBase() as vb" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="text-xs text-gray-500">Wahlberechtigte</div>
          <div class="text-2xl font-semibold">{{ vb.eligible_secondary_definitive | number }}</div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="text-xs text-gray-500">Wähler/innen</div>
          <div class="text-2xl font-semibold">{{ vb.actual_secondary_definitive | number }}</div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="text-xs text-gray-500">Gültige Zweitstimmen</div>
          <div class="text-2xl font-semibold">{{ vb.valid_secondary_definitive | number }}</div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="text-xs text-gray-500">Ungültige Zweitstimmen</div>
          <div class="text-2xl font-semibold">{{ vb.invalid_secondary_definitive | number }}</div>
        </div>
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Sitzverteilung</h2>
        <div *ngIf="parties().length > 0; else noParties" class="space-y-2">
          <div class="flex justify-between text-sm text-gray-600">
            <div>Partei</div>
            <div>Sitze</div>
          </div>
          <div class="space-y-2">
            <div *ngFor="let p of parties()" class="bg-white rounded-lg border border-gray-200 p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full" [style.backgroundColor]="p.color ? '#' + p.color : '#94a3b8'"></div>
                  <div class="font-medium">{{ p.abbreviation || p.name }}</div>
                  <div *ngIf="p.part_of_coalition" class="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Regierungspartei</div>
                </div>
                <div class="text-gray-700 font-semibold">{{ p.seat_count }}</div>
              </div>
              <div class="mt-2 h-2 bg-gray-100 rounded">
                <div class="h-2 rounded" [style.width.%]="(p.seat_count / totalSeats()) * 100" [style.backgroundColor]="p.color ? '#' + p.color : '#60a5fa'"></div>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noParties>
          <p class="text-gray-500">Keine Parteidaten gefunden.</p>
        </ng-template>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Zweitstimmen</h2>
        <app-bar-chart [data]="partyVotes()" />
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Weiterführend</h2>
        <div class="flex flex-wrap gap-3">
          <a [routerLink]="['/election', year(), 'states']" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
            Bundesländer ({{ year() }})
          </a>
        </div>
      </section>
    </div>
  `,
})
export class ElectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private electionService = inject(ElectionService);

  year = signal<number>(0);
  parties = signal<ElectionPartyView[]>([]);
  voteBase = signal<ElectionVoteBaseView | null>(null);
  totalSeats = computed(() => this.parties().reduce((sum, p) => sum + p.seat_count, 0) || 1);
  partyVotes = signal<BarDatum[]>([]);

  ngOnInit(): void {
    const yearParam = Number(this.route.snapshot.paramMap.get('year'));
    this.year.set(yearParam);

    // Load data on the server during prerender
    this.electionService.getElectionPartiesByYear(yearParam).subscribe((list) => this.parties.set(list));
    this.electionService.getElectionVoteBase(yearParam).subscribe((vb) => this.voteBase.set(vb));
    this.electionService.getElectionPartyVoteShares(yearParam).subscribe((rows) => {
      this.partyVotes.set(
        rows.map((r) => ({ label: r.abbreviation || r.name, value: r.votes, color: r.color ? '#' + r.color : null }))
      );
    });
  }
}


