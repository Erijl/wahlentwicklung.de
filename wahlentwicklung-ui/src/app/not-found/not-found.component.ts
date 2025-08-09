import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <div class="text-9xl font-black text-gray-200">404</div>
        <h1 class="mt-2 text-2xl font-bold text-gray-900">Seite nicht gefunden</h1>
        <p class="mt-1 text-gray-600">Die angeforderte Seite existiert nicht.</p>
        <div class="mt-6">
          <a routerLink="/" class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Zur Startseite</a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}


