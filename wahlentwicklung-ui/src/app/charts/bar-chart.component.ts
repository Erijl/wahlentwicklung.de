import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

export type BarDatum = { label: string; value: number; color?: string | null };

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <div *ngFor="let d of dataSorted" class="">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full" [style.backgroundColor]="d.color || '#60a5fa'"></span>
            <span class="font-medium text-gray-800">{{ d.label }}</span>
          </div>
          <div class="tabular-nums text-gray-700">{{ d.value | number }}</div>
        </div>
        <div class="mt-1 h-2 bg-gray-100 rounded">
          <div class="h-2 rounded" [style.width.%]="maxValue ? (d.value / maxValue) * 100 : 0" [style.backgroundColor]="d.color || '#60a5fa'"></div>
        </div>
      </div>
    </div>
  `,
})
export class BarChartComponent implements OnChanges {
  @Input() data: BarDatum[] = [];
  dataSorted: BarDatum[] = [];
  maxValue = 0;

  ngOnChanges(): void {
    this.dataSorted = [...this.data].sort((a, b) => b.value - a.value);
    this.maxValue = this.dataSorted.reduce((m, d) => Math.max(m, d.value), 0);
  }
}


