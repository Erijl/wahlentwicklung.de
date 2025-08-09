import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-election-one-stat',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto p-8">
      <a routerLink="/elections" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">← Zurück zur Übersicht</a>
      <header class="mt-4 mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Einzelstatistik</h1>
        <p class="text-gray-600">Schnellansicht der Auswahl</p>
      </header>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="text-sm text-gray-500">Wahljahr</div>
            <div class="text-xl font-semibold">{{ year() }}</div>
          </div>
          <div *ngIf="state()">
            <div class="text-sm text-gray-500">Bundesland</div>
            <div class="text-xl font-semibold">{{ state() }}</div>
          </div>
          <div *ngIf="constituency()">
            <div class="text-sm text-gray-500">Wahlkreis</div>
            <div class="text-xl font-semibold">{{ constituency() }}</div>
          </div>
          <div *ngIf="party()">
            <div class="text-sm text-gray-500">Partei</div>
            <div class="text-xl font-semibold">{{ party() }}</div>
          </div>
        </div>

        <div class="mt-8 text-gray-600">
          Inhalte folgen. Diese Seite ist vorbereitet für SSG und Navigation.
        </div>
      </div>
    </div>
  `,
})
export class ElectionOneStatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  year = signal<number>(0);
  state = signal<string | null>(null);
  constituency = signal<string | null>(null);
  party = signal<string | null>(null);

  ngOnInit(): void {
    this.year.set(Number(this.route.snapshot.paramMap.get('year')));
    const s = this.route.snapshot.paramMap.get('state');
    const c = this.route.snapshot.paramMap.get('constituency');
    const p = this.route.snapshot.paramMap.get('party');
    if (s) this.state.set(decodeURIComponent(s));
    if (c) this.constituency.set(decodeURIComponent(c));
    if (p) this.party.set(decodeURIComponent(p));
  }
}


