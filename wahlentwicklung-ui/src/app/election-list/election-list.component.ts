import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ElectionService } from '../election.service';
import { proto } from '../protos/objects';
import Election = proto.objects.Election;

@Component({
  selector: 'app-election-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-8">
      <header class="mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">
          Wahlergebnisse
        </h1>
        <p class="mt-2 text-lg text-gray-600">
          Übersicht der Bundestagswahlen
        </p>
      </header>

      <div *ngIf="elections$ | async as elections; else loading">
        <div *ngIf="elections.length > 0; else noData" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <!-- We will make these links later -->
          <div *ngFor="let election of elections"
               class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 text-center cursor-pointer border border-gray-200">
            <div class="text-gray-500 text-sm">Bundestagswahl</div>
            <div class="text-3xl font-bold text-blue-600 mt-1">
              {{ election.year }}
            </div>
          </div>

        </div>
      </div>

      <ng-template #loading>
        <p class="text-gray-500">Lade Wahldaten...</p>
      </ng-template>

      <ng-template #noData>
        <p class="text-center text-red-500 bg-red-50 p-4 rounded-md">
          Keine Wahlen in der Datenbank gefunden oder Fehler beim Laden.
        </p>
      </ng-template>
    </div>
  `,
})
export class ElectionListComponent implements OnInit {
  elections$!: Observable<Election[]>;

  constructor(private electionService: ElectionService) {}

  ngOnInit(): void {
    this.elections$ = this.electionService.getElectionYears();
  }
}
