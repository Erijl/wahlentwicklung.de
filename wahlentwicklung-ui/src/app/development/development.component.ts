import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-development',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto p-8">
      <a routerLink="/" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">← Start</a>
      <header class="mt-4 mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Entwicklung: {{ kind() }} – {{ name() }}</h1>
        <p class="text-gray-600">Zeitliche Entwicklung, wird in Kürze mit Diagrammen gefüllt.</p>
      </header>

      <div class="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
        In Arbeit – die Seite ist vorbereitet und wird statisch generiert.
      </div>
    </div>
  `,
})
export class DevelopmentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  kind = signal<'party' | 'state' | 'constituency'>('party');
  name = signal<string>('');

  ngOnInit(): void {
    const url = this.route.snapshot.url.map(s => s.path);
    if (url[0] === 'party') this.kind.set('party');
    if (url[0] === 'state') this.kind.set('state');
    if (url[0] === 'constituency') this.kind.set('constituency');
    const n = this.route.snapshot.paramMap.get('name') ?? '';
    this.name.set(decodeURIComponent(n));
  }
}


