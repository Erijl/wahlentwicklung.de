import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';

let Database: any = require('better-sqlite3');

export interface Election {
  year: number;
}


@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /**
   * Fetches a list of all election years from the database.
   */
  getElectionYears(): Observable<Election[]> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });

        // Prepare and run the query against your 'election' table
        const stmt = db.prepare('SELECT year FROM election ORDER BY year DESC');
        const elections = stmt.all() as Election[];
        db.close();

        return of(elections);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }

    // Fallback
    return of([]);
  }
}
