import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-8 text-center text-gray-600">
      <h1 class="text-2xl font-bold mb-2">Coming soon</h1>
      <p>Diese Seite ist in Arbeit.</p>
    </div>
  `,
})
export class PlaceholderComponent {}


