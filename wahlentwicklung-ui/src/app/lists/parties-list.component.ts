import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ElectionService } from '../election.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-parties-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto p-8">
      <header class="mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Parteien</h1>
        <p class="text-gray-600">Alle Parteien mit Metadaten</p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <a *ngFor="let p of parties()" [routerLink]="['/party', p.abbreviation || p.name]" class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full" [style.backgroundColor]="p.color ? '#' + p.color : '#cbd5e1'"></span>
            <div class="font-semibold text-gray-800">{{ p.abbreviation || p.name }}</div>
          </div>
          <div class="text-sm text-gray-600">{{ p.name }}</div>
        </a>
      </div>
    </div>
  `,
})
export class PartiesListComponent implements OnInit {
  private svc = inject(ElectionService);
  parties = signal<Array<{ id: number; name: string; abbreviation?: string | null; color?: string | null }>>([]);

  ngOnInit(): void {
    this.svc.getParties().subscribe((rows) => this.parties.set(rows));
  }
}


